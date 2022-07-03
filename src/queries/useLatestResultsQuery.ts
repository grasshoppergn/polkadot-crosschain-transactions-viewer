import { useChainInfo } from "../hooks/useChainInfo";
import { useInfiniteQuery } from "react-query";
import { gql, request } from "graphql-request";
import { XcmTransfer } from "../types/XcmTransfer";
import { useCallback } from "react";

export function useLatestResultsQuery() {
  const { apiUrl } = useChainInfo(true);
  const query = useInfiniteQuery(
    ["latestResults"],
    ({ pageParam = "" }) =>
      request<{
        xCMTransfers: {
          pageInfo: {
            endCursor: string;
            hasNextPage: boolean;
          };
          totalCount: number;
          nodes: Array<XcmTransfer>;
        };
      }>(
        apiUrl || "",
        gql`
          query ($pageParam: Cursor) {
            xCMTransfers(first: 2, orderBy: BLOCK_NUMBER_DESC, after: $pageParam) {
              pageInfo {
                endCursor
                hasNextPage
              }
              totalCount
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
        { pageParam },
      ),
    {
      getNextPageParam: ({
        xCMTransfers: {
          pageInfo: { hasNextPage, endCursor },
        },
      }) => (hasNextPage ? endCursor : undefined),
    },
  );
  const loadMore = useCallback(() => {
    if (query.hasNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);
  const allNodes = query.data?.pages.map(page => page.xCMTransfers.nodes).flat();
  return [query, loadMore, allNodes] as const;
}
