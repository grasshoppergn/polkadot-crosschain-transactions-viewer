import { useChainInfo } from "../hooks/useChainInfo";
import { useQuery } from "react-query";
import { gql, request } from "graphql-request";
import { XcmTransfer } from "../types/XcmTransfer";

export function useSearchQuery(search: string) {
  const { apiUrl, dbId: parachainId } = useChainInfo(true);
  return useQuery(
    ["search", parachainId, search],
    () =>
      request<{
        [key in "from" | "hash" | "to"]: {
          nodes: Array<XcmTransfer>;
        };
      }>(
        apiUrl || "",
        gql`
          query ($search: String, $parachainId: String) {
            hash: xCMTransfers(
              filter: { xcmpMessageHash: { includesInsensitive: $search } }
              first: 10
              orderBy: BLOCK_NUMBER_DESC
            ) {
              nodes {
                id
              }
            }
            from: xCMTransfers(
              filter: {
                fromParachainId: { equalToInsensitive: $parachainId }
                fromAddress: { includesInsensitive: $search }
              }
              first: 10
              orderBy: BLOCK_NUMBER_DESC
            ) {
              nodes {
                id
              }
            }
            to: xCMTransfers(
              filter: {
                toParachainId: { equalToInsensitive: $parachainId }
                toAddress: { includesInsensitive: $search }
              }
              first: 10
              orderBy: BLOCK_NUMBER_DESC
            ) {
              nodes {
                id
              }
            }
          }
        `,
        { parachainId, search },
      )
        .then(({ hash: { nodes: hash }, from: { nodes: from }, to: { nodes: to } }) =>
          Array.from(new Set([...hash, ...from, ...to].map(item => item.id)).keys()),
        )
        .then(ids =>
          request<{
            xCMTransfers: {
              nodes: Array<XcmTransfer>;
            };
          }>(
            apiUrl || "",
            gql`
              query ($ids: [String!]) {
                xCMTransfers(filter: { id: { in: $ids } }) {
                  nodes {
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
            { ids },
          ),
        ),
    {
      enabled: !!(search && apiUrl),
    },
  );
}
