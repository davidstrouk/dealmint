import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dealmint/prisma";
import { AvailNexusService } from "@dealmint/core";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Fetch settlement
    const settlement = await prisma.settlement.findFirst({
      where: { dealId },
      orderBy: { createdAt: "desc" },
    });

    if (!settlement) {
      return NextResponse.json(
        { error: "Settlement not found" },
        { status: 404 }
      );
    }

    // If already completed, return cached status
    if (settlement.status === "completed" || settlement.status === "failed") {
      return NextResponse.json(settlement);
    }

    // Get latest status from Avail Nexus
    const nexusService = new AvailNexusService();
    const status = await nexusService.getIntentStatus(settlement.intentId);

    // Update settlement record
    const updatedSettlement = await prisma.settlement.update({
      where: { id: settlement.id },
      data: {
        status: status.status,
        detailJson: JSON.stringify({
          ...JSON.parse(settlement.detailJson),
          executionReceipt: {
            bridgeTxHash: status.bridgeTxHash,
            executionTxHash: status.executionTxHash,
          },
        }),
      },
    });

    // Update deal status if completed
    if (status.status === "completed") {
      await prisma.deal.update({
        where: { id: dealId },
        data: { status: "settled" },
      });
    }

    return NextResponse.json(updatedSettlement);
  } catch (error) {
    console.error("Error fetching settlement status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
