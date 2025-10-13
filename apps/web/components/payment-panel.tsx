'use client';

import { useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { PYUSD_ADDRESSES, ERC20_ABI } from '@dealmint/core';
import type { Deal, Agreement, Payment } from '@dealmint/core';

interface PaymentPanelProps {
  deal: Deal;
  agreement?: Agreement | null;
  payment?: Payment | null;
  onPaymentComplete: (txHash: string) => Promise<void>;
}

export function PaymentPanel({ deal, agreement, payment, onPaymentComplete }: PaymentPanelProps) {
  const { address, isConnected } = useAccount();
  const [isPaying, setIsPaying] = useState(false);
  
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const amount = agreement ? agreement.finalAmount : deal.amount;
  const recipientAddress = deal.creatorAddress;

  const handlePayment = async () => {
    if (!isConnected || !address) return;

    setIsPaying(true);
    try {
      // Convert USD amount to PYUSD (assuming 1:1 peg, 6 decimals)
      const amountInPyusd = parseUnits(amount.toString(), 6);

      writeContract({
        address: PYUSD_ADDRESSES.sepolia as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountInPyusd],
      });
    } catch (error) {
      console.error('Payment error:', error);
      setIsPaying(false);
    }
  };

  // Handle successful transaction
  if (isSuccess && hash && !payment) {
    onPaymentComplete(hash);
    setIsPaying(false);
  }

  const hasPayment = !!payment;
  const canPay = isConnected && !hasPayment && (agreement || !deal.allowNegotiation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span>Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-gray-600">Connect your wallet to pay with PYUSD</p>
            <ConnectButton />
          </div>
        ) : hasPayment ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Payment Confirmed</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold">${payment.amount.toFixed(2)} PYUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-semibold capitalize">{payment.network}</span>
              </div>
              <div>
                <a
                  href={payment.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View on Explorer →
                </a>
              </div>
            </div>
          </div>
        ) : deal.allowNegotiation && !agreement ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-900 font-medium">Negotiation Required</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Please run the negotiation first to determine the final amount.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount to Pay:</span>
                <span className="font-semibold text-2xl">${amount.toFixed(2)} PYUSD</span>
              </div>
              {agreement && (
                <div className="text-sm text-green-600">
                  You saved ${(deal.amount - amount).toFixed(2)} through negotiation!
                </div>
              )}
            </div>

            <Button
              onClick={handlePayment}
              disabled={!canPay}
              isLoading={isPaying || isConfirming}
              className="w-full"
            >
              {isConfirming ? 'Confirming...' : 'Pay with PYUSD'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Payment will be sent to {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)} on Sepolia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

