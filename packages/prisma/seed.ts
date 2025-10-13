import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo deal
  const demoDeal = await prisma.deal.create({
    data: {
      slug: "demo-enterprise-license",
      title: "Enterprise Software License - Q4 2025",
      amount: 1000.0,
      allowNegotiation: true,
      status: "created",
      creatorAddress: "0x1234567890123456789012345678901234567890",
    },
  });

  console.log("✓ Created demo deal:", demoDeal.slug);

  // Create a sample agreement with AP2 mandate
  const demoAgreement = await prisma.agreement.create({
    data: {
      dealId: demoDeal.id,
      finalAmount: 960.0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      mandateJson: JSON.stringify({
        type: "PaymentMandate",
        version: "1.0",
        id: `mandate-${demoDeal.id}`,
        issuer: {
          address: demoDeal.creatorAddress,
          name: "DealMint Seller Agent",
        },
        payer: {
          name: "DealMint Buyer Agent",
        },
        amount: {
          value: 960.0,
          currency: "USD",
          token: "PYUSD",
        },
        terms: {
          originalAmount: 1000.0,
          discount: 40.0,
          discountReason: "Early payment (4%) applied",
          deadline: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        createdAt: new Date().toISOString(),
      }),
      a2aTranscript: JSON.stringify({
        protocol: "A2A",
        version: "1.0",
        messages: [
          {
            timestamp: new Date().toISOString(),
            from: "seller-agent",
            to: "buyer-agent",
            type: "offer",
            content: {
              message: "Initial offer: $1,000 for Enterprise License",
              amount: 1000.0,
            },
          },
          {
            timestamp: new Date(Date.now() + 1000).toISOString(),
            from: "buyer-agent",
            to: "seller-agent",
            type: "counter-offer",
            content: {
              message: "Requesting early payment discount",
              proposedAmount: 960.0,
            },
          },
          {
            timestamp: new Date(Date.now() + 2000).toISOString(),
            from: "seller-agent",
            to: "buyer-agent",
            type: "accept",
            content: {
              message: "Accepted: 4% early payment discount applied",
              finalAmount: 960.0,
              discount: 40.0,
            },
          },
        ],
      }),
    },
  });

  console.log("✓ Created demo agreement with AP2 mandate");

  // Create a mock payment record
  const demoPayment = await prisma.payment.create({
    data: {
      dealId: demoDeal.id,
      token: "PYUSD",
      amount: 960.0,
      txHash:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      network: "sepolia",
      explorerUrl:
        "https://sepolia.etherscan.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      status: "confirmed",
    },
  });

  console.log("✓ Created mock payment record");

  // Create a mock settlement record
  const demoSettlement = await prisma.settlement.create({
    data: {
      dealId: demoDeal.id,
      sourceNetwork: "sepolia",
      destNetwork: "base-sepolia",
      destToken: "USDC",
      intentId: "avail-intent-demo-12345",
      status: "completed",
      detailJson: JSON.stringify({
        sourceChainId: 11155111,
        destChainId: 84532,
        bridgeAmount: 960.0,
        executionReceipt: {
          bridgeTxHash:
            "0x1111111111111111111111111111111111111111111111111111111111111111",
          executionTxHash:
            "0x2222222222222222222222222222222222222222222222222222222222222222",
        },
      }),
    },
  });

  console.log("✓ Created mock settlement record");

  // Update deal status
  await prisma.deal.update({
    where: { id: demoDeal.id },
    data: { status: "settled" },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
