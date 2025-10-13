/**
 * AP2 (Agent Payments Protocol) Types
 * Standardized payment mandate format for agent-based transactions
 */

export interface PaymentMandate {
  type: "PaymentMandate";
  version: string;
  id: string;
  issuer: MandateIssuer;
  payer: MandatePayer;
  amount: MandateAmount;
  terms: MandateTerms;
  createdAt: string;
  expiresAt?: string;
}

export interface MandateIssuer {
  address: string;
  name: string;
  agentId?: string;
}

export interface MandatePayer {
  address?: string;
  name: string;
  agentId?: string;
}

export interface MandateAmount {
  value: number;
  currency: string;
  token: string;
  network?: string;
}

export interface MandateTerms {
  originalAmount?: number;
  discount?: number;
  discountReason?: string;
  deadline: string;
  conditions?: string[];
  paymentMethod?: string;
}

export interface MandateValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
