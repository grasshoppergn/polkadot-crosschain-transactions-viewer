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
  const result = useSearchQuery(search);
  return (
    <div className={className}>
      <h4>
        Searching "{search}" in {name} chain:
      </h4>
      {result.isLoading ? (
        <Spinner />
      ) : (
        result.data?.xCMTransfers.nodes.map(item => <Item item={item} key={item.id} />)
      )}
    </div>
  );
}
