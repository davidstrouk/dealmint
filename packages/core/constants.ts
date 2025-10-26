/**
 * DealMint Constants
 * Contract addresses, chain IDs, and configuration
 */

// PYUSD Contract Addresses
export const PYUSD_ADDRESSES = {
  // Sepolia testnet - using a placeholder address
  // Note: Update with actual PYUSD testnet address if available
  sepolia: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
  // Mainnet
  mainnet: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
} as const;

// Chain IDs
export const CHAIN_IDS = {
  sepolia: 11155111,
  mainnet: 1,
  baseSepolia: 84532,
  base: 8453,
} as const;

// Explorer URLs
export const EXPLORER_URLS = {
  sepolia: "https://sepolia.etherscan.io",
  mainnet: "https://etherscan.io",
  baseSepolia: "https://sepolia.basescan.org",
  base: "https://basescan.org",
} as const;

// ERC-20 ABI (minimal - just what we need)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

// Network configurations
export const NETWORKS = {
  sepolia: {
    id: CHAIN_IDS.sepolia,
    name: "Sepolia",
    rpcUrl:
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
    explorerUrl: EXPLORER_URLS.sepolia,
    pyusdAddress: PYUSD_ADDRESSES.sepolia,
  },
  baseSepolia: {
    id: CHAIN_IDS.baseSepolia,
    name: "Base Sepolia",
    rpcUrl:
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ||
      "https://sepolia.base.org",
    explorerUrl: EXPLORER_URLS.baseSepolia,
  },
} as const;

// App configuration
export const APP_CONFIG = {
  name: "DealMint",
  tagline: "Negotiate, mint the mandate, and settle anywhere.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "1.0.0",
} as const;

// API configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Theme colors
export const THEME_COLORS = {
  primary: "#10B981", // Mint green
  background: "#0B1220", // Dark slate
  surface: "#F8FAFC", // Off-white
  accent: "#34D399", // Light mint
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
} as const;
