import classNames from "classnames";
import css from "./Content.module.scss";
import { ChangeEventHandler, useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useParams } from "react-router-dom";

interface ContentProps {
  className?: string;
}

export function Content({ className: c }: ContentProps) {
  const className = classNames(css.container, c);
  const navigate = useNavigate();
  const [value, setValue] = useState(useParams<"search">()["search"] ?? "");
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    setValue(e.target.value);
  }, []);
  const onButtonClick = useCallback(() => {
    navigate(encodeURIComponent(value));
  }, [navigate, value]);
  const onResetClick = useCallback(() => {
    setValue("");
    navigate("");
  }, [setValue, navigate]);

  return (
    <div className={className}>
      <input type="text" className={css.input} value={value} onChange={onChange} />
      <span onClick={onResetClick}>X</span>
      <button onClick={onButtonClick}>Search</button>
      <Outlet />
    </div>
  );
}
