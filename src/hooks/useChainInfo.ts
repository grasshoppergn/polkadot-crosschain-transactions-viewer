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
    dbId: [null /*, "0"*/] as Array<string | null>,
    name: "Kusama",
    logo: kusamaLogo,
    style: css.kusamaStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-kusama__c2Vya",
  },
  karura: {
    id: "karura",
    dbId: ["2000"] as Array<string | null>,
    name: "Karura",
    logo: karuraLogo,
    style: css.karuraStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-karura__c2Vya",
  },
  moonriver: {
    id: "moonriver",
    dbId: ["2023", "2,023"] as Array<string | null>,
    name: "Moonriver",
    logo: moonriverLogo,
    style: css.moonriverStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-moonriver__c2Vya",
  },
  basilisk: {
    id: "basilisk",
    dbId: ["2090"] as Array<string | null>,
    name: "Basilisk",
    logo: basiliskLogo,
    style: css.basiliskStyle,
    apiUrl: "https://api.subquery.network/sq/serkul/subql-xcm-basilisk__c2Vya",
  },
} as const;

export const CHAIN_BY_DB_ID = Object.values(CHAIN_INFO).reduce((res, item) => {
  for (const dbId of item.dbId) {
    res.set(dbId, item);
  }
  return res;
}, new Map<string | null, typeof CHAIN_INFO[keyof typeof CHAIN_INFO]>());

export const DEFAULT_CHAIN: ChainType = "moonriver";

export type ChainType = keyof typeof CHAIN_INFO;
