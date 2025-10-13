'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-react';
import type { Deal, Payment, Settlement } from '@dealmint/core';

interface SettlementPanelProps {
  deal: Deal;
  payment?: Payment | null;
  settlement?: Settlement | null;
  onSettle: () => Promise<void>;
}

export function SettlementPanel({ deal, payment, settlement, onSettle }: SettlementPanelProps) {
  const [isSettling, setIsSettling] = useState(false);

  const handleSettle = async () => {
    setIsSettling(true);
    try {
      await onSettle();
    } finally {
      setIsSettling(false);
    }
  };

  const canSettle = payment && !settlement;
  const isSettled = settlement?.status === 'completed';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <span>Cross-Chain Settlement</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!payment ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Payment Required</p>
                <p className="text-gray-600 text-sm mt-1">
                  Complete the payment before settling cross-chain.
                </p>
              </div>
            </div>
          </div>
        ) : isSettled ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Settlement Complete</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Source:</span>
                <span className="font-semibold capitalize">{settlement?.sourceNetwork}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination:</span>
                <span className="font-semibold capitalize">{settlement?.destNetwork}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-semibold">{settlement?.destToken}</span>
              </div>
            </div>
          </div>
        ) : settlement ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-900 font-medium">Settlement In Progress</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Status: {settlement.status}
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Intent ID: {settlement.intentId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Powered by Avail Nexus</h4>
              <p className="text-gray-700 text-sm mb-3">
                Bridge your PYUSD from Ethereum to USDC on Base seamlessly.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">PYUSD</div>
                  <div className="text-gray-600">Sepolia</div>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">USDC</div>
                  <div className="text-gray-600">Base Sepolia</div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSettle}
              disabled={!canSettle}
              isLoading={isSettling}
              className="w-full"
            >
              Settle Cross-Chain
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Estimated time: ~5 minutes • Powered by Avail Nexus
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

