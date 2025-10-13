'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { formatDate, formatAmount } from '@/lib/utils';
import type { Deal, Agreement, Payment, Settlement } from '@dealmint/core';

interface ReceiptCardProps {
  deal: Deal;
  agreement?: Agreement | null;
  payment?: Payment | null;
  settlement?: Settlement | null;
}

export function ReceiptCard({ deal, agreement, payment, settlement }: ReceiptCardProps) {
  const handleDownload = () => {
    const receipt = {
      dealTitle: deal.title,
      originalAmount: deal.amount,
      finalAmount: agreement?.finalAmount || deal.amount,
      paymentTxHash: payment?.txHash,
      paymentNetwork: payment?.network,
      settlementIntentId: settlement?.intentId,
      settlementStatus: settlement?.status,
      createdAt: deal.createdAt,
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealmint-receipt-${deal.slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const settlementDetails = settlement?.detailJson ? JSON.parse(settlement.detailJson) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Receipt & Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Deal Information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Deal Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-right">{deal.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{deal.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(deal.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {payment && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Payment Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatAmount(payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token:</span>
                  <span className="font-medium">{payment.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium capitalize">{payment.network}</span>
                </div>
                <div className="pt-2">
                  <a
                    href={payment.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:underline"
                  >
                    <span>View on Etherscan</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Settlement Information */}
          {settlement && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Settlement Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{settlement.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium capitalize">{settlement.sourceNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium capitalize">{settlement.destNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dest. Token:</span>
                  <span className="font-medium">{settlement.destToken}</span>
                </div>
                {settlementDetails?.executionReceipt && (
                  <div className="pt-2 space-y-1">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${settlementDetails.executionReceipt.bridgeTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary hover:underline"
                    >
                      <span>Bridge Transaction</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://sepolia.basescan.org/tx/${settlementDetails.executionReceipt.executionTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary hover:underline"
                    >
                      <span>Execution Transaction</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

