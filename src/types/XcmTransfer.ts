export interface XcmTransfer {
  nodeId: string;
  id: string | null;
  blockNumber: string | null;
  timestamp: string | null;
  fromAddress: string | null;
  fromParachainId: string | null;
  toAddress: string | null;
  toParachainId: string | null;
  assetParachainId: string | null;
  assetId: string | null;
  // multiAssetJSON: string | null;
  amount: string | null;
  xcmpMessageStatus: string | null;
  xcmpMessageHash: string | null;
  // xcmpInstructions: json;
  warnings: string | null;
}

export type Direction = "both" | "from" | "to" | "none";

export type json = null | string | number | Array<json> | { [key: string]: json };
