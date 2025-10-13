import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dealmint/prisma";
import { getExplorerUrl } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    const body = await request.json();
    const { txHash, network } = body;

    if (!txHash || !network) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { agreement: true },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { dealId, txHash },
    });

    if (existingPayment) {
      return NextResponse.json(existingPayment);
    }

    // Determine amount
    const amount = deal.agreement ? deal.agreement.finalAmount : deal.amount;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        dealId: deal.id,
        token: "PYUSD",
        amount,
        txHash,
        network,
        explorerUrl: getExplorerUrl(network, txHash),
        status: "confirmed", // In production, you'd verify the transaction on-chain
      },
    });

    // Update deal status
    await prisma.deal.update({
      where: { id: dealId },
      data: { status: "paid" },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
