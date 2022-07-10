import { useChainInfo } from "../hooks/useChainInfo";
import { gql } from "graphql-request";
import { usePagedQuery } from "./usePagedQuery";

export function useLatestResultsQuery(pageSize = 10) {
  const { dbId } = useChainInfo(true);
  return usePagedQuery(
    ["latestResults", dbId],
    gql`
      query ($pageSize: Int, $pageParam: Cursor) {
        xCMTransfers(first: $pageSize, orderBy: BLOCK_NUMBER_DESC, after: $pageParam) {
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
    pageParam => ({ pageParam, pageSize }),
  );
}
