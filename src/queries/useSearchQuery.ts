import { useChainInfo } from "../hooks/useChainInfo";
import { gql } from "graphql-request";
import { usePagedQuery } from "./usePagedQuery";

export function useSearchQuery(search: string, pageSize = 10) {
  const { dbId } = useChainInfo(true);
  const [parachainIdCanBeNull, parachainIds] = dbId.reduce(
    ([canBeNull, ids], item) => [canBeNull || item === null, item === null ? ids : [...ids, item]],
    [false, [] as Array<string>],
  );
  return usePagedQuery(
    ["search", dbId, search],
    gql`
      query (
        $pageSize: Int
        $pageParam: Cursor
        $search: String
        $parachainIds: [String!]
        $parachainIdCanBeNull: Boolean
      ) {
        xCMTransfers(
          filter: {
            or: [
              {
                or: [
                  { fromParachainId: { in: $parachainIds } }
                  {
                    and: [
                      { fromParachainId: { isNull: $parachainIdCanBeNull } }
                      { fromParachainId: { isNull: true } }
                    ]
                  }
                ]
                fromAddress: { includesInsensitive: $search }
              }
              {
                or: [
                  { toParachainId: { in: $parachainIds } }
                  {
                    and: [
                      { toParachainId: { isNull: $parachainIdCanBeNull } }
                      { toParachainId: { isNull: true } }
                    ]
                  }
                ]
                toAddress: { includesInsensitive: $search }
              }
            ]
          }
          first: $pageSize
          orderBy: BLOCK_NUMBER_DESC
          after: $pageParam
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
          nodes {
            nodeId
            id
            blockNumber
            timestamp
            fromAddress
            fromParachainId
            toAddress
            toParachainId
            assetParachainId
            assetId
            amount
            xcmpMessageStatus
            xcmpMessageHash
            warnings
          }
        }
      }
    `,
    pageParam => ({ pageParam, pageSize, parachainIds, parachainIdCanBeNull, search }),
  );
}
