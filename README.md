# DealMint

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

> **Negotiate, mint the mandate, and settle anywhere.**

A negotiation-first, on-chain checkout application built for ETHOnline 2025. DealMint combines AI agent negotiation with PYUSD payments and Avail Nexus cross-chain settlement.

![DealMint](https://via.placeholder.com/1200x400/10B981/FFFFFF?text=DealMint)

## 🌟 Features

- **AI Agent Negotiation**: Automated A2A protocol-based negotiation between buyer and seller agents
- **AP2 Payment Mandates**: Standardized payment mandate generation following Agent Payments Protocol
- **PYUSD Payments**: Pay with PayPal's USD stablecoin on Ethereum
- **Cross-Chain Settlement**: Bridge assets via Avail Nexus from Ethereum to Base
- **Full Transparency**: Real-time transaction timeline with explorer links
- **QR Code Sharing**: Easy deal sharing with QR codes

## 🏗️ Architecture

```
dealmint/
├── apps/
│   └── web/                 # Next.js 14 (App Router) + Tailwind + TypeScript
│       ├── app/
│       │   ├── api/         # Backend API routes
│       │   ├── d/[slug]/    # Deal checkout page
│       │   └── new/         # Create deal form
│       └── components/      # React components
├── packages/
│   ├── core/                # Shared business logic
│   │   ├── negotiation/     # Negotiation engine & mandate generator
│   │   ├── nexus/           # Avail Nexus SDK wrapper
│   │   └── types/           # TypeScript types (A2A, AP2)
│   └── prisma/              # Database schema & client
└── package.json             # Monorepo root
```

## 🎯 How We Use PYUSD (PayPal Prize)

DealMint leverages **PayPal USD (PYUSD)** as the primary payment token for on-chain transactions:

### Integration Details

1. **ERC-20 Transfers**: PYUSD is used as an ERC-20 token on Ethereum Sepolia testnet
2. **Payment Flow**:

   - Users connect their wallet via RainbowKit
   - Smart contract interaction using wagmi + viem
   - Direct PYUSD transfer to seller's address
   - Transaction confirmed on-chain

3. **Contract**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9` (Sepolia)

### Code Example

```typescript
// Payment execution in PaymentPanel.tsx
writeContract({
  address: PYUSD_ADDRESSES.sepolia,
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [recipientAddress, amountInPyusd],
});
```

### Why PYUSD?

- **Stablecoin**: 1:1 peg with USD ensures predictable pricing
- **PayPal backing**: Trust and reliability from a major payment provider
- **Low fees**: ERC-20 standard with efficient gas usage
- **Cross-chain ready**: Can be bridged to other chains via Avail Nexus

## 🌐 How We Use Avail Nexus (Avail Prize)

**Avail Nexus** powers our cross-chain settlement layer, enabling seamless bridging from Ethereum to Base:

### Integration Details

1. **Unification Layer**: Avail Nexus acts as a cross-chain intent aggregator
2. **Bridge & Execute**:

   - Source: PYUSD on Ethereum Sepolia
   - Destination: USDC on Base Sepolia
   - Intent-based execution with automatic routing

3. **SDK Wrapper**: Custom `AvailNexusService` class wraps the SDK

### Code Example

```typescript
// Settlement initiation in settle/[id]/route.ts
const nexusService = new AvailNexusService();
const { intentId } = await nexusService.bridgeAndExecute({
  sourceChain: "sepolia",
  destChain: "base-sepolia",
  token: "PYUSD",
  amount: parseUnits(amount.toString(), 6),
  recipient: creatorAddress,
});
```

### Why Avail Nexus?

- **Unified Interface**: Single API for multiple bridge protocols
- **Intent-Based**: User expresses intent, system finds best execution path
- **Cross-Chain Settlement**: Enables true multi-chain deal execution
- **Status Tracking**: Built-in intent status monitoring

## 🤖 A2A Protocol Explanation

**Agent-to-Agent (A2A)** is an open standard for AI agent interoperability:

### Our Implementation

- **Seller Agent**: Offers initial price, accepts/rejects counter-offers
- **Buyer Agent**: Requests discounts, negotiates terms
- **Message Types**: offer, counter-offer, accept, reject, negotiate
- **Transcript**: Full conversation history stored as JSON

### Example Transcript

```json
{
  "protocol": "A2A",
  "version": "1.0",
  "messages": [
    {
      "timestamp": "2025-10-13T10:00:00Z",
      "from": "seller-agent",
      "to": "buyer-agent",
      "type": "offer",
      "content": {
        "message": "Initial offer: $1,000",
        "amount": 1000
      }
    },
    {
      "timestamp": "2025-10-13T10:00:01Z",
      "from": "buyer-agent",
      "to": "seller-agent",
      "type": "counter-offer",
      "content": {
        "message": "Requesting early payment discount",
        "proposedAmount": 960
      }
    }
  ]
}
```

## 📄 AP2 Payment Mandate Explanation

**Agent Payments Protocol (AP2)** standardizes payment mandates between agents:

### Mandate Structure

```json
{
  "type": "PaymentMandate",
  "version": "1.0",
  "id": "mandate-abc123",
  "issuer": {
    "address": "0x1234...",
    "name": "DealMint Seller Agent"
  },
  "payer": {
    "name": "DealMint Buyer Agent"
  },
  "amount": {
    "value": 960.0,
    "currency": "USD",
    "token": "PYUSD"
  },
  "terms": {
    "originalAmount": 1000.0,
    "discount": 40.0,
    "discountReason": "Early payment (4%)",
    "deadline": "2025-10-20T10:00:00Z"
  }
}
```

### Benefits

- **Standardization**: Common format for payment agreements
- **Auditability**: Immutable record of negotiated terms
- **Automation**: Machine-readable for automated execution
- **Compliance**: Clear terms for regulatory requirements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dealmint.git
cd dealmint

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

Visit `http://localhost:3000`

### Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# PYUSD Contract (Sepolia)
NEXT_PUBLIC_PYUSD_ADDRESS="0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9"
NEXT_PUBLIC_CHAIN_ID="11155111"

# Avail Nexus SDK
NEXUS_API_KEY="your_key_here"
NEXUS_ENDPOINT="https://api.nexus.avail.so"

# RPC URLs (use Alchemy/Infura)
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/..."
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL="https://base-sepolia.g.alchemy.com/v2/..."
```

## 📖 Usage Guide

See [demo.md](./demo.md) for a complete 2-minute walkthrough.

### Quick Flow

1. **Create Deal**: `/new` → Enter title, amount, enable negotiation
2. **Share Link**: Copy deal URL or scan QR code
3. **Negotiate**: Run AI agent negotiation to get discounts
4. **Pay**: Connect wallet, pay with PYUSD
5. **Settle**: Bridge to Base via Avail Nexus
6. **Receipt**: Download transaction receipt

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Wallet**: wagmi, viem, RainbowKit
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM + SQLite
- **Blockchain**: Ethereum (Sepolia), Base (Base Sepolia)
- **Payments**: PYUSD (ERC-20)
- **Cross-Chain**: Avail Nexus SDK
- **Protocols**: A2A, AP2

## 📊 Database Schema

```prisma
model Deal {
  id               String
  slug             String  @unique
  title            String
  amount           Float
  allowNegotiation Boolean
  status           String  // created, negotiated, paid, settling, settled
  creatorAddress   String

  agreement   Agreement?
  payments    Payment[]
  settlements Settlement[]
}

model Agreement {
  id            String
  finalAmount   Float
  deadline      DateTime
  mandateJson   String  // AP2 mandate
  a2aTranscript String  // A2A conversation
}

model Payment {
  token       String  // "PYUSD"
  amount      Float
  txHash      String
  network     String
  status      String
}

model Settlement {
  sourceNetwork String
  destNetwork   String
  destToken     String
  intentId      String  // Avail Nexus intent ID
  status        String
}
```

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Database studio
pnpm db:studio
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup

1. Set all environment variables in Vercel dashboard
2. Connect PostgreSQL database (replace SQLite in production)
3. Deploy

## 🤝 Contributing

This is a hackathon project built for ETHOnline 2025. Contributions welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🏆 ETHOnline 2025

Built for:

- **PayPal Prize**: PYUSD integration for stablecoin payments
- **Avail Prize**: Nexus SDK for cross-chain settlement
- **Innovation**: A2A + AP2 agent negotiation protocols

## 🔗 Links

- [Live Demo](https://dealmint.vercel.app)
- [GitHub](https://github.com/yourusername/dealmint)
- [ETHOnline Submission](https://ethglobal.com/showcase/dealmint)

## 👥 Team

Built by [Your Name] for ETHOnline 2025

---

**DealMint** - Where AI agents negotiate, PYUSD flows, and Avail settles across chains.
