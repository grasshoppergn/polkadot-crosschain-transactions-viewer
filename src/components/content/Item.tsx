import classNames from "classnames";
import css from "./Item.module.scss";
import { Direction, XcmTransfer } from "../../types/XcmTransfer";
import { useCallback, useState } from "react";
import { CHAIN_BY_DB_ID, useChainInfo } from "../../hooks/useChainInfo";
import { IconButton } from "../common/IconButton";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faChevronUp, faClose } from "@fortawesome/free-solid-svg-icons";
import { useFindCounterpartsQuery } from "../../queries/useFindCounterpartsQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "../common/Spinner";

interface ItemProps {
  className?: string;
  item: XcmTransfer & { direction: Direction };
}

export function Item({ className: c, item }: ItemProps) {
  const counterpartItemQuery = useFindCounterpartsQuery(item);
  const counterpartItem = counterpartItemQuery.data;
  const direction = item.direction;
  const [from, to] =
    direction === "from" ? ([item, counterpartItem] as const) : ([counterpartItem, item] as const);

  const itemParachain = useChainInfo(false);
  const counterpartParachain = CHAIN_BY_DB_ID.get(
    direction === "from" ? item.toParachainId : item.fromParachainId,
  );

  const {
    timestamp,
    fromParachainId,
    fromAddress,
    // amount,
    // blockNumber,
    // assetParachainId,
    // assetId,
    // xcmpMessageStatus,
  } = from ?? item;
  const { toParachainId, toAddress } = to ?? item;

  const time = new Date(timestamp || Date.now()).toLocaleString();
  const fromParachain = CHAIN_BY_DB_ID.get(fromParachainId);
  const toParachain = CHAIN_BY_DB_ID.get(toParachainId);
  const [copiedFromAddress, setCopiedFromAddress] = useState(false);
  const copyFromAddress = useCallback(async () => {
    try {
      if (fromAddress) {
        await navigator.clipboard.writeText(fromAddress);
        setCopiedFromAddress(true);
      }
    } catch (e) {
      console.error("Failed to copy to clipboard");
    }
  }, [fromAddress]);
  const leaveCopiedFromAddress = useCallback(() => setCopiedFromAddress(false), []);
  const [copiedToAddress, setCopiedToAddress] = useState(false);
  const copyToAddress = useCallback(async () => {
    try {
      if (toAddress) {
        await navigator.clipboard.writeText(toAddress);
        setCopiedToAddress(true);
      }
    } catch (e) {
      console.error("Failed to copy to clipboard");
    }
  }, [toAddress]);
  const leaveCopiedToAddress = useCallback(() => setCopiedToAddress(false), []);

  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = useCallback(() => setCollapsed(value => !value), []);
  const className = classNames(css.container, c, {
    [css.collapsed]: collapsed,
    [css.directionBoth]: direction === "both",
    [css.directionFrom]: direction === "from",
    [css.directionTo]: direction === "to",
    [css.directionNone]: direction === "none",
  });
  return direction === "none" ? null : (
    <div className={className}>
      <div className={css.firstRow}>
        <div className={css.timeStamp}>{time}</div>
        <div className={css.counterpartDirection}>from</div>
        <div className={css.counterpartParachain}>
          {fromParachain ? (
            <img
              src={fromParachain.logo}
              className={css.counterpartLogo}
              alt={fromParachain.name}
              title={fromParachain.name}
            />
          ) : (
            <FontAwesomeIcon
              icon={faClose}
              className={css.counterpartLogo}
              title={"Unknown parachain"}
            />
          )}
        </div>
        <div className={css.counterpartAddress}>
          <input type="text" value={fromAddress || ""} placeholder={"null address"} readOnly />
          {!!fromAddress && (
            <IconButton
              icon={copiedFromAddress ? faCheck : faCopy}
              className={css.copyButton}
              onClick={copyFromAddress}
              onMouseLeave={leaveCopiedFromAddress}
            />
          )}
        </div>
        <div className={css.counterpartDirection}>to</div>
        <div className={css.counterpartParachain}>
          {toParachain ? (
            <img
              src={toParachain.logo}
              className={css.counterpartLogo}
              alt={toParachain.name}
              title={toParachain.name}
            />
          ) : (
            <FontAwesomeIcon
              icon={faClose}
              className={css.counterpartLogo}
              title={"Unknown parachain"}
            />
          )}
        </div>
        <div className={css.counterpartAddress}>
          <input type="text" value={toAddress || ""} placeholder={"null address"} readOnly />
          {!!toAddress && (
            <IconButton
              icon={copiedToAddress ? faCheck : faCopy}
              className={css.copyButton}
              onClick={copyToAddress}
              onMouseLeave={leaveCopiedToAddress}
            />
          )}
        </div>
        {counterpartItemQuery.isLoading ? (
          <Spinner />
        ) : (
          <FontAwesomeIcon
            icon={counterpartItem ? faCheck : faClose}
            className={css.counterpartLogo}
            title={
              counterpartItem ? "Found counterpart message" : "Couldn't find counterpart message"
            }
          />
        )}
        <IconButton icon={faChevronUp} className={css.collapseToggle} onClick={toggleCollapsed} />
      </div>
      <div className={css.content}>
        <h5>Message in {itemParachain?.name ?? "Unknown"} parachain</h5>
        <pre>{JSON.stringify(item, undefined, 2)}</pre>
        {counterpartItemQuery.isLoading ? (
          <Spinner />
        ) : (
          counterpartParachain &&
          counterpartItem && (
            <>
              <h5>Message in {counterpartParachain?.name ?? "Unknown"} parachain</h5>
              <pre>{JSON.stringify(counterpartItem, undefined, 2)}</pre>
            </>
          )
        )}
      </div>
    </div>
  );
}
