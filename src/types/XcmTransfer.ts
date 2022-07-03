export interface XcmTransfer {
  id: string | null;
  blockNumber: string | null;
  timestamp: string | null;
  fromAddress: string | null;
  fromParachainId: string | null;
  toAddress: string | null;
  toParachainId: string | null;
  assetParachainId: string | null;
  assetId: string | null;
  amount: number | null;
  xcmpMessageStatus: string | null;
  xcmpMessageHash: string | null;
  warnings: string | null;
}
