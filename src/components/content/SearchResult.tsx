import classNames from "classnames";
import css from "./SearchResult.module.scss";
import { useChainInfo } from "../../hooks/useChainInfo";
import { Item } from "./Item";
import { Spinner } from "../common/Spinner";
import { useSearchQuery } from "../../queries/useSearchQuery";

interface SearchResultProps {
  className?: string;
  search: string;
}

export function SearchResult({ className: c, search }: SearchResultProps) {
  const className = classNames(css.container, c);
  const { name } = useChainInfo(true);
  const [query, loadMore, allNodes] = useSearchQuery(search);
  return (
    <div className={className}>
      <h2>
        Searching "{search}" in {name} chain:
      </h2>
      {allNodes?.map(item => (
        <Item item={item} key={item.id} />
      ))}
      {query.isLoading || query.isFetchingNextPage ? (
        <Spinner />
      ) : (
        query.hasNextPage && <button onClick={loadMore}>Load more</button>
      )}
    </div>
  );
}
