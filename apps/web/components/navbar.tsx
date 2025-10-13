'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Deal<span className="text-primary">Mint</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              href="/new"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Create Deal
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

