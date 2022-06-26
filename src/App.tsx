import classNames from "classnames";
import css from "./App.module.scss";
import { TopMenu } from "./components/topMenu/TopMenu";
import { Content } from "./components/content/Content";
import { useChainInfo } from "./hooks/useChainInfo";
import { Navigate } from "react-router-dom";

export function App() {
  const { style } = useChainInfo(false) || {};

  return style ? (
    <div className={classNames(css.container, style)}>
      <TopMenu />
      <Content />
    </div>
  ) : (
    <Navigate to={"/kusama"} />
  );
}
