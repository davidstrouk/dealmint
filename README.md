# DealMint

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

> **Negotiate, mint the mandate, and settle anywhere.**

A negotiation-first, on-chain checkout application built for ETHOnline 2025. DealMint combines AI agent negotiation with PYUSD payments and Avail Nexus cross-chain settlement.

![DealMint](https://via.placeholder.com/1200x400/10B981/FFFFFF?text=DealMint)

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [PYUSD Integration](#-how-we-use-pyusd-paypal-prize)
- [Avail Nexus Integration](#-how-we-use-avail-nexus-avail-prize)
- [A2A Protocol](#-a2a-protocol-explanation)
- [AP2 Payment Mandate](#-ap2-payment-mandate-explanation)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Security Considerations](#-security-considerations)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Features

- **AI Agent Negotiation**: Automated A2A protocol-based negotiation between buyer and seller agents
- **AP2 Payment Mandates**: Standardized payment mandate generation following Agent Payments Protocol
- **PYUSD Payments**: Pay with PayPal's USD stablecoin on Ethereum
- **Cross-Chain Settlement**: Bridge assets via Avail Nexus from Ethereum to Base
- **Full Transparency**: Real-time transaction timeline with explorer links
- **QR Code Sharing**: Easy deal sharing with QR codes

## 🏗️ Architecture

DealMint follows a monorepo architecture with clear separation of concerns:

```
dealmint/
├── apps/
│   └── web/                 # Next.js 14 (App Router) + Tailwind + TypeScript
│       ├── app/
│       │   ├── api/         # Backend API routes
│       │   │   ├── deals/   # Deal CRUD operations
│       │   │   ├── negotiations/ # A2A negotiation endpoints
│       │   │   ├── pay/     # PYUSD payment handlers
│       │   │   └── settle/  # Avail Nexus settlement
│       │   ├── d/[slug]/    # Deal checkout page (dynamic routing)
│       │   ├── new/         # Create deal form
│       │   └── page.tsx     # Homepage
│       ├── components/      # React components
│       │   ├── ui/          # Reusable UI components
│       │   ├── negotiation-panel.tsx
│       │   ├── payment-panel.tsx
│       │   └── settlement-panel.tsx
│       └── lib/             # Utility functions & configs
├── packages/
│   ├── core/                # Shared business logic
│   │   ├── negotiation/     # Negotiation engine & mandate generator
│   │   │   ├── engine.ts    # A2A protocol implementation
│   │   │   └── mandate-generator.ts # AP2 mandate creation
│   │   ├── nexus/           # Avail Nexus SDK wrapper
│   │   │   └── client.ts    # Cross-chain bridge client
│   │   ├── types/           # TypeScript types (A2A, AP2)
│   │   └── constants.ts     # Shared constants & configs
│   └── prisma/              # Database layer
│       ├── schema.prisma    # Database schema
│       ├── seed.ts          # Seed data
│       └── generated/       # Generated Prisma client
└── package.json             # Monorepo root
```

### Key Design Principles

- **Monorepo Structure**: Using pnpm workspaces for code sharing
- **Type Safety**: Strict TypeScript throughout the codebase
- **API-First**: Clean separation between frontend and backend
- **Protocol-Driven**: Following A2A and AP2 standards
- **Chain-Agnostic**: Built for multi-chain operations via Avail Nexus

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
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";

const { writeContract } = useWriteContract();

// Execute PYUSD payment
const executePyusdPayment = async () => {
  const amountInWei = parseUnits(amount.toString(), 6); // PYUSD has 6 decimals

  writeContract({
    address: PYUSD_ADDRESSES.sepolia,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [recipientAddress, amountInWei],
  });
};
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

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/downloads))
- **MetaMask** or compatible Web3 wallet

### Installation

Follow these steps to set up the project locally:

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

# Run all checks
pnpm test:all
```

## 🔒 Security Considerations

DealMint is a hackathon project. For production use, consider these security enhancements:

- **Private Keys**: Never commit private keys or sensitive credentials
- **Environment Variables**: Use secure secret management (e.g., Vercel env, AWS Secrets Manager)
- **Input Validation**: Validate all user inputs and API responses
- **Smart Contract Audits**: Audit any custom smart contracts before mainnet deployment
- **Rate Limiting**: Implement rate limiting on API endpoints
- **CORS Configuration**: Configure CORS appropriately for production
- **Database Security**: Use connection pooling and prepared statements (Prisma handles this)
- **Wallet Integration**: Follow best practices for wallet connection and transaction signing

> ⚠️ **Important:** This is a testnet implementation. Additional security measures are required for mainnet deployment.

## 🔧 Troubleshooting

### Common Issues

#### `pnpm install` fails

- **Solution**: Make sure you're using Node.js 18+ and pnpm 8+
- Run `node --version` and `pnpm --version` to check

#### Database connection error

- **Solution**: Ensure your `DATABASE_URL` is correctly set in `.env.local`
- Try deleting `dev.db` and running `pnpm db:push` again

#### Wallet connection issues

- **Solution**: Make sure you're on the correct network (Sepolia)
- Clear your browser cache and reconnect wallet
- Check that your wallet has ETH for gas fees

#### PYUSD transfer fails

- **Solution**: Verify you have PYUSD tokens in your wallet
- Get test PYUSD from [PayPal faucet](https://faucet.circle.com)
- Ensure you have ETH for gas fees on Sepolia

#### Avail Nexus bridge not working

- **Solution**: Check your `NEXUS_API_KEY` is valid
- Verify both source and destination chains are supported
- Check intent status at Avail Nexus dashboard

### Getting Help

- Check the [demo.md](./demo.md) for a complete walkthrough
- Open an issue on GitHub for bugs or feature requests
- Review the transaction on block explorer if payment/settlement fails

## 🚢 Deployment

### Vercel (Recommended)

DealMint is optimized for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to your account
vercel login

# Deploy to production
vercel --prod
```

### Environment Setup

1. **Set Environment Variables** in Vercel dashboard:

   - `DATABASE_URL` - PostgreSQL connection string (use Vercel Postgres)
   - `NEXT_PUBLIC_PYUSD_ADDRESS` - PYUSD contract address
   - `NEXT_PUBLIC_CHAIN_ID` - Chain ID (11155111 for Sepolia)
   - `NEXT_PUBLIC_SEPOLIA_RPC_URL` - RPC endpoint
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` - Base RPC endpoint
   - `NEXUS_API_KEY` - Avail Nexus API key
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID

2. **Database Migration**:

   - Replace SQLite with PostgreSQL in production
   - Run `pnpm db:push` to apply schema
   - Optionally seed with `pnpm db:seed`

3. **Build and Deploy**:
   - Vercel automatically builds on git push
   - Monitor deployment logs for any issues

### Alternative Deployment Options

- **Docker**: Create a Dockerfile for containerized deployment
- **AWS**: Deploy using AWS Amplify or Elastic Beanstalk
- **Railway**: One-click deploy with automatic PostgreSQL setup
- **Self-hosted**: Use `pnpm build` and `pnpm start` on your server

## 🤝 Contributing

This is a hackathon project built for ETHOnline 2025. We welcome contributions from the community!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages

### Areas for Contribution

- 🐛 Bug fixes and improvements
- 📝 Documentation enhancements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Multi-language support

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
