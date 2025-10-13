import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dealmint/prisma";
import { NegotiationEngine, MandateGenerator } from "@dealmint/core";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Fetch deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (!deal.allowNegotiation) {
      return NextResponse.json(
        { error: "Negotiation not allowed for this deal" },
        { status: 400 }
      );
    }

    // Check if agreement already exists
    const existingAgreement = await prisma.agreement.findUnique({
      where: { dealId },
    });

    if (existingAgreement) {
      return NextResponse.json(existingAgreement);
    }

    // Run negotiation engine
    const negotiationEngine = new NegotiationEngine();
    const negotiationResult = await negotiationEngine.negotiate({
      originalAmount: deal.amount,
      dealTitle: deal.title,
      requestEarlyPayment: true,
      requestBulkDiscount: deal.amount >= 500,
      timeUntilDeadline: 7,
    });

    // Get A2A transcript
    const a2aTranscript = negotiationEngine.getTranscript();

    // Generate AP2 mandate
    const mandateGenerator = new MandateGenerator();
    const mandate = mandateGenerator.generate({
      dealId: deal.id,
      dealTitle: deal.title,
      originalAmount: deal.amount,
      negotiationResult,
      issuerAddress: deal.creatorAddress,
    });

    // Save agreement
    const agreement = await prisma.agreement.create({
      data: {
        dealId: deal.id,
        finalAmount: negotiationResult.finalAmount,
        deadline: negotiationResult.deadline,
        mandateJson: JSON.stringify(mandate),
        a2aTranscript: JSON.stringify(a2aTranscript),
      },
    });

    // Update deal status
    await prisma.deal.update({
      where: { id: dealId },
      data: { status: "negotiated" },
    });

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error("Error running negotiation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
