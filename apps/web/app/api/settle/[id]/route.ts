import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dealmint/prisma";
import { AvailNexusService } from "@dealmint/core";
import { parseUnits } from "viem";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    const body = await request.json();
    const { sourceNetwork, destNetwork, destToken } = body;

    if (!sourceNetwork || !destNetwork || !destToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch deal and payment
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        agreement: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (!deal.payments.length) {
      return NextResponse.json(
        { error: "Payment required before settlement" },
        { status: 400 }
      );
    }

    // Check if settlement already exists
    const existingSettlement = await prisma.settlement.findFirst({
      where: { dealId },
    });

    if (existingSettlement) {
      return NextResponse.json(existingSettlement);
    }

    const payment = deal.payments[0];
    const amount = payment.amount;

    // Initialize Avail Nexus service
    const nexusService = new AvailNexusService();

    // Call bridgeAndExecute
    const { intentId } = await nexusService.bridgeAndExecute({
      sourceChain: sourceNetwork,
      destChain: destNetwork,
      token: "PYUSD",
      amount: parseUnits(amount.toString(), 6),
      recipient: deal.creatorAddress,
      sourceChainId: 11155111, // Sepolia
      destChainId: 84532, // Base Sepolia
    });

    // Create settlement record
    const settlement = await prisma.settlement.create({
      data: {
        dealId: deal.id,
        sourceNetwork,
        destNetwork,
        destToken,
        intentId,
        status: "pending",
        detailJson: JSON.stringify({
          sourceChainId: 11155111,
          destChainId: 84532,
          bridgeAmount: amount,
        }),
      },
    });

    // Update deal status
    await prisma.deal.update({
      where: { id: dealId },
      data: { status: "settling" },
    });

    // Simulate settlement completion (in production, this would be a webhook/polling)
    setTimeout(async () => {
      try {
        const status = await nexusService.getIntentStatus(intentId);

        await prisma.settlement.update({
          where: { id: settlement.id },
          data: {
            status: status.status,
            detailJson: JSON.stringify({
              sourceChainId: 11155111,
              destChainId: 84532,
              bridgeAmount: amount,
              executionReceipt: {
                bridgeTxHash: status.bridgeTxHash,
                executionTxHash: status.executionTxHash,
              },
            }),
          },
        });

        if (status.status === "completed") {
          await prisma.deal.update({
            where: { id: dealId },
            data: { status: "settled" },
          });
        }
      } catch (error) {
        console.error("Error updating settlement status:", error);
      }
    }, 5000); // 5 seconds delay for demo

    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    console.error("Error initiating settlement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
