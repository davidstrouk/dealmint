export interface Deal {
  id: string;
  slug: string;
  title: string;
  amount: number;
  allowNegotiation: boolean;
  status: DealStatus;
  creatorAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DealStatus =
  | "created"
  | "negotiated"
  | "paid"
  | "settling"
  | "settled"
  | "failed";

export interface Agreement {
  id: string;
  dealId: string;
  finalAmount: number;
  deadline: Date;
  mandateJson: string;
  a2aTranscript: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  dealId: string;
  token: string;
  amount: number;
  txHash: string;
  network: string;
  explorerUrl: string;
  status: PaymentStatus;
  createdAt: Date;
}

export type PaymentStatus = "pending" | "confirmed" | "failed";

export interface Settlement {
  id: string;
  dealId: string;
  sourceNetwork: string;
  destNetwork: string;
  destToken: string;
  intentId: string;
  status: SettlementStatus;
  detailJson: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SettlementStatus =
  | "pending"
  | "bridging"
  | "executing"
  | "completed"
  | "failed";

export interface NegotiationResult {
  finalAmount: number;
  discount: number;
  discountReason: string;
  deadline: Date;
  success: boolean;
}

export interface CreateDealInput {
  title: string;
  amount: number;
  allowNegotiation: boolean;
  creatorAddress: string;
}
