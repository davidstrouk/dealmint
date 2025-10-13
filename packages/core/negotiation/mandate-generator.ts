import type { PaymentMandate } from "../types/ap2";
import type { NegotiationResult } from "../types";

export interface MandateGeneratorInput {
  dealId: string;
  dealTitle: string;
  originalAmount: number;
  negotiationResult: NegotiationResult;
  issuerAddress: string;
  payerName?: string;
}

export class MandateGenerator {
  /**
   * Generate AP2-style payment mandate from negotiation results
   */
  generate(input: MandateGeneratorInput): PaymentMandate {
    const {
      dealId,
      dealTitle,
      originalAmount,
      negotiationResult,
      issuerAddress,
      payerName,
    } = input;

    const mandate: PaymentMandate = {
      type: "PaymentMandate",
      version: "1.0",
      id: `mandate-${dealId}`,
      issuer: {
        address: issuerAddress,
        name: "DealMint Seller Agent",
        agentId: `seller-${issuerAddress.slice(0, 8)}`,
      },
      payer: {
        name: payerName || "DealMint Buyer Agent",
        agentId: "buyer-agent",
      },
      amount: {
        value: negotiationResult.finalAmount,
        currency: "USD",
        token: "PYUSD",
        network: "sepolia",
      },
      terms: {
        originalAmount,
        discount: negotiationResult.discount,
        discountReason: negotiationResult.discountReason,
        deadline: negotiationResult.deadline.toISOString(),
        conditions: [
          "Payment must be made in PYUSD on Sepolia network",
          "Settlement available via Avail Nexus to Base",
          `Deal: ${dealTitle}`,
        ],
        paymentMethod: "PYUSD ERC-20 Transfer",
      },
      createdAt: new Date().toISOString(),
      expiresAt: negotiationResult.deadline.toISOString(),
    };

    return mandate;
  }

  /**
   * Validate a payment mandate
   */
  validate(mandate: PaymentMandate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mandate.type || mandate.type !== "PaymentMandate") {
      errors.push("Invalid mandate type");
    }

    if (!mandate.id) {
      errors.push("Mandate ID is required");
    }

    if (!mandate.amount || mandate.amount.value <= 0) {
      errors.push("Invalid amount");
    }

    if (!mandate.issuer || !mandate.issuer.address) {
      errors.push("Issuer address is required");
    }

    if (!mandate.terms || !mandate.terms.deadline) {
      errors.push("Payment deadline is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
