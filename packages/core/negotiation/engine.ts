import type { NegotiationResult } from "../types";
import type { A2ATranscript, A2AMessage } from "../types/a2a";

export interface NegotiationInput {
  originalAmount: number;
  dealTitle: string;
  requestEarlyPayment?: boolean;
  requestBulkDiscount?: boolean;
  timeUntilDeadline?: number; // days
}

export class NegotiationEngine {
  private transcript: A2AMessage[] = [];

  /**
   * Run negotiation between buyer and seller agents
   * Applies percentage discounts and time-based incentives
   */
  async negotiate(input: NegotiationInput): Promise<NegotiationResult> {
    const {
      originalAmount,
      dealTitle,
      requestEarlyPayment,
      requestBulkDiscount,
      timeUntilDeadline = 7,
    } = input;

    // Start negotiation
    this.addMessage({
      timestamp: new Date().toISOString(),
      from: "seller-agent",
      to: "buyer-agent",
      type: "offer",
      content: {
        message: `Initial offer: $${originalAmount} for ${dealTitle}`,
        amount: originalAmount,
      },
    });

    let finalAmount = originalAmount;
    let totalDiscount = 0;
    const discountReasons: string[] = [];

    // Apply early payment discount (up to 10%)
    if (requestEarlyPayment) {
      const earlyPaymentDiscount = this.calculateEarlyPaymentDiscount(
        originalAmount,
        timeUntilDeadline
      );
      finalAmount -= earlyPaymentDiscount;
      totalDiscount += earlyPaymentDiscount;
      discountReasons.push(
        `Early payment (${(
          (earlyPaymentDiscount / originalAmount) *
          100
        ).toFixed(1)}%)`
      );

      this.addMessage({
        timestamp: new Date(Date.now() + 1000).toISOString(),
        from: "buyer-agent",
        to: "seller-agent",
        type: "counter-offer",
        content: {
          message: "Requesting early payment discount",
          proposedAmount: finalAmount,
        },
      });
    }

    // Apply bulk discount (5%)
    if (requestBulkDiscount && originalAmount >= 500) {
      const bulkDiscount = originalAmount * 0.05;
      finalAmount -= bulkDiscount;
      totalDiscount += bulkDiscount;
      discountReasons.push("Bulk purchase (5%)");

      this.addMessage({
        timestamp: new Date(Date.now() + 2000).toISOString(),
        from: "buyer-agent",
        to: "seller-agent",
        type: "negotiate",
        content: {
          message: "Requesting bulk purchase discount",
          proposedAmount: finalAmount,
        },
      });
    }

    // Apply time-based urgency discount (bonus for quick decisions)
    if (timeUntilDeadline <= 3) {
      const urgencyDiscount = originalAmount * 0.02; // 2% for urgent deals
      finalAmount -= urgencyDiscount;
      totalDiscount += urgencyDiscount;
      discountReasons.push("Urgent closure (2%)");
    }

    // Final acceptance
    this.addMessage({
      timestamp: new Date(Date.now() + 3000).toISOString(),
      from: "seller-agent",
      to: "buyer-agent",
      type: "accept",
      content: {
        message: `Accepted: ${discountReasons.join(" + ")} applied`,
        finalAmount,
        discount: totalDiscount,
      },
    });

    // Calculate deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + timeUntilDeadline);

    return {
      finalAmount: Math.round(finalAmount * 100) / 100, // Round to 2 decimals
      discount: Math.round(totalDiscount * 100) / 100,
      discountReason: discountReasons.join(", "),
      deadline,
      success: true,
    };
  }

  /**
   * Calculate early payment discount based on time until deadline
   * Closer to deadline = higher discount (up to 10%)
   */
  private calculateEarlyPaymentDiscount(
    amount: number,
    daysUntilDeadline: number
  ): number {
    // Scale discount: 30+ days = 2%, 7-30 days = 4%, 3-7 days = 6%, <3 days = 10%
    let discountPercentage = 0.02;

    if (daysUntilDeadline <= 3) {
      discountPercentage = 0.1;
    } else if (daysUntilDeadline <= 7) {
      discountPercentage = 0.06;
    } else if (daysUntilDeadline <= 30) {
      discountPercentage = 0.04;
    }

    return amount * discountPercentage;
  }

  private addMessage(message: A2AMessage): void {
    this.transcript.push(message);
  }

  getTranscript(): A2ATranscript {
    return {
      protocol: "A2A",
      version: "1.0",
      messages: this.transcript,
      participants: {
        seller: {
          name: "DealMint Seller Agent",
          capabilities: ["offer", "accept", "negotiate"],
          version: "1.0",
        },
        buyer: {
          name: "DealMint Buyer Agent",
          capabilities: ["counter-offer", "negotiate", "accept"],
          version: "1.0",
        },
      },
    };
  }
}
