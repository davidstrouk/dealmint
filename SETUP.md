# DealMint Setup Guide

Quick setup instructions for getting DealMint running locally.

⏱️ **Estimated setup time:** 10-15 minutes

## Prerequisites

- Node.js 18+ installed
- pnpm 8+ installed (`npm install -g pnpm`)
- Git

## Installation Steps

> 💡 **Tip:** Follow these steps in order for a smooth setup experience.

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/dealmint.git
cd dealmint

# Install all dependencies
pnpm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp apps/web/.env.local.example apps/web/.env.local

# Edit the file with your values
nano apps/web/.env.local
```

**Required values:**

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from https://cloud.walletconnect.com
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` - Get from Alchemy or Infura
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` - Get from Alchemy or Infura
- `NEXUS_API_KEY` - Get from Avail (or leave for mock)

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with demo data
pnpm db:seed
```

### 4. Start Development Server

```bash
# Start Next.js dev server
pnpm dev
```

Visit http://localhost:3000

## Getting Testnet Tokens

### Sepolia ETH

- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### PYUSD on Sepolia

For testing purposes, you can:

1. Check [PayPal developer documentation](https://developer.paypal.com/docs/multiparty/checkout/advanced/pyusd/) for test tokens
2. Use a PYUSD faucet if available
3. Deploy a mock ERC-20 token for local testing

> ⚠️ **Note:** PYUSD testnet faucets may have limited availability.

### Base Sepolia ETH

- https://www.alchemy.com/faucets/base-sepolia

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Type checking
pnpm type-check       # Check TypeScript types
pnpm lint             # Run ESLint
```

## Troubleshooting

### Issue: `pnpm install` fails

**Solution**:

```bash
# Clear cache and retry
pnpm store prune
pnpm install
```

### Issue: Prisma client not found

**Solution**:

```bash
pnpm db:generate
```

### Issue: Database locked

**Solution**:

```bash
# Stop all processes
# Delete dev.db and dev.db-journal
rm packages/prisma/dev.db*
pnpm db:push
pnpm db:seed
```

### Issue: Port 3000 already in use

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 pnpm dev
```

## Project Structure

```
dealmint/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # App router pages & API
│       ├── components/   # React components
│       └── lib/          # Utility functions
├── packages/
│   ├── core/            # Business logic
│   │   ├── negotiation/ # A2A negotiation engine
│   │   ├── nexus/       # Avail Nexus client
│   │   └── types/       # TypeScript types
│   └── prisma/          # Database layer
│       ├── schema.prisma
│       └── seed.ts
└── package.json         # Workspace root
```

## Next Steps

1. Check out [README.md](./README.md) for full documentation
2. Follow [demo.md](./demo.md) for a guided walkthrough
3. Start building your deals!

## Support

For issues or questions:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the demo walkthrough

Happy building! 🚀
