import css from "./useChainInfo.module.scss";
import { useParams } from "react-router-dom";
import kusamaLogo from "../images/kusama-logo.gif";
import karuraLogo from "../images/karura-logo.svg";
import moonriverLogo from "../images/moonriver-logo.svg";
import basiliskLogo from "../images/basilisk-logo.png";

export function useChainInfo(throwIfNotFound: true): typeof CHAIN_INFO[ChainType];
export function useChainInfo(throwIfNotFound: false): typeof CHAIN_INFO[ChainType] | undefined;
export function useChainInfo(throwIfNotFound: boolean): typeof CHAIN_INFO[ChainType] | undefined {
  const { chain } = useParams<"chain">();
  const chainId = String(chain).toLowerCase() as ChainType;
  const result = CHAIN_INFO[chainId];
  if (!result && throwIfNotFound) {
    throw Error("Can't find requested blockchain");
  }
  return result;
}

export const CHAIN_INFO = {
  kusama: {
    id: "kusama",
    dbId: "1",
    name: "Kusama",
    logo: kusamaLogo,
    style: css.kusamaStyle,
    apiUrl: undefined,
  },
  karura: {
    id: "karura",
    dbId: "2000",
    name: "Karura",
    logo: karuraLogo,
    style: css.karuraStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-karura__c2Vya",
  },
  moonriver: {
    id: "moonriver",
    dbId: "2023",
    name: "Moonriver",
    logo: moonriverLogo,
    style: css.moonriverStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-moonriver__c2Vya",
  },
  basilisk: {
    id: "basilisk",
    dbId: "4",
    name: "Basilisk",
    logo: basiliskLogo,
    style: css.basiliskStyle,
    apiUrl: undefined,
  },
} as const;

export const DEFAULT_CHAIN: ChainType = "moonriver";

export type ChainType = keyof typeof CHAIN_INFO;
