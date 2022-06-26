import css from "./useChainInfo.module.scss";
import { useParams } from "react-router-dom";

export function useChainInfo(throwIfNotFound: true): typeof CHAIN_INFO[ChainType];
export function useChainInfo(throwIfNotFound: false): typeof CHAIN_INFO[ChainType] | undefined;
export function useChainInfo(throwIfNotFound: boolean): typeof CHAIN_INFO[ChainType] | undefined {
  const { chain } = useParams<"chain">();
  const chainId = String(chain).toLowerCase() as ChainType;
  const result = CHAIN_INFO[chainId];
  console.log(chainId, result);
  if (!result && throwIfNotFound) {
    throw Error("Can't find requested blockchain");
  }
  return result;
}

export const CHAIN_INFO = {
  polkadot: {
    id: "polkadot",
    name: "Polkadot",
    logo: process.env.PUBLIC_URL + "/images/polkadot-logo.svg",
    style: css.polkadotStyle,
  },
  statemint: {
    id: "statemint",
    name: "Statemint",
    logo: process.env.PUBLIC_URL + "/images/statemint-logo.svg",
    style: css.statemintStyle,
  },
  kusama: {
    id: "kusama",
    name: "Kusama",
    logo: process.env.PUBLIC_URL + "/images/kusama-logo.gif",
    style: css.kusamaStyle,
  },
  moonriver: {
    id: "moonriver",
    name: "Moonriver",
    logo: process.env.PUBLIC_URL + "/images/moonriver-logo.svg",
    style: css.moonriverStyle,
  },
} as const;

export type ChainType = keyof typeof CHAIN_INFO;
