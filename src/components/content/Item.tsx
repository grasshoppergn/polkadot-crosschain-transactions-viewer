import classNames from "classnames";
import css from "./Item.module.scss";
import { XcmTransfer } from "../../types/XcmTransfer";

interface ItemProps {
  className?: string;
  item: XcmTransfer;
}

export function Item({ className: c, item }: ItemProps) {
  const className = classNames(css.container, c);
  return (
    <div className={className}>
      <pre>{JSON.stringify(item, undefined, 2)}</pre>
    </div>
  );
}
