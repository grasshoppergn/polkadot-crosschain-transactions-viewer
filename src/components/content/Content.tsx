import classNames from "classnames";
import css from "./Content.module.scss";

interface ContentProps {
  className?: string;
}

export function Content({ className: c }: ContentProps) {
  const className = classNames(css.container, c);

  return (
    <div className={className}>
      <input type="text" className={css.input} />
    </div>
  );
}
