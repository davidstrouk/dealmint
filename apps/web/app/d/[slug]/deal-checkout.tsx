'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatAmount } from '@/lib/utils';
import { NegotiationPanel } from '@/components/negotiation-panel';
import { PaymentPanel } from '@/components/payment-panel';
import { SettlementPanel } from '@/components/settlement-panel';
import { Timeline } from '@/components/timeline';
import { ReceiptCard } from '@/components/receipt-card';
import { QrModal } from '@/components/qr-modal';
import { Badge } from 'lucide-react';
import type { Deal, Agreement, Payment, Settlement } from '@dealmint/core';

interface DealCheckoutProps {
  deal: Deal;
  agreement: Agreement | null;
  payment: Payment | null;
  settlement: Settlement | null;
}

export function DealCheckout({ 
  deal: initialDeal, 
  agreement: initialAgreement, 
  payment: initialPayment, 
  settlement: initialSettlement 
}: DealCheckoutProps) {
  const router = useRouter();
  const [deal] = useState(initialDeal);
  const [agreement, setAgreement] = useState(initialAgreement);
  const [payment, setPayment] = useState(initialPayment);
  const [settlement, setSettlement] = useState(initialSettlement);

  const handleNegotiate = async () => {
    try {
      const response = await fetch(`/api/negotiations/${deal.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Negotiation failed');
      }

      const data = await response.json();
      setAgreement(data);
      router.refresh();
    } catch (error) {
      console.error('Negotiation error:', error);
      alert('Failed to run negotiation. Please try again.');
    }
  };

  const handlePaymentComplete = async (txHash: string) => {
    try {
      const response = await fetch(`/api/pay/${deal.id}/pyusd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          network: 'sepolia',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const data = await response.json();
      setPayment(data);
      router.refresh();
    } catch (error) {
      console.error('Payment recording error:', error);
    }
  };

  const handleSettle = async () => {
    try {
      const response = await fetch(`/api/settle/${deal.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceNetwork: 'sepolia',
          destNetwork: 'base-sepolia',
          destToken: 'USDC',
        }),
      });

      if (!response.ok) {
        throw new Error('Settlement failed');
      }

      const data = await response.json();
      setSettlement(data);
      router.refresh();
    } catch (error) {
      console.error('Settlement error:', error);
      alert('Failed to initiate settlement. Please try again.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{deal.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                Amount: <span className="font-semibold text-primary text-lg">{formatAmount(deal.amount)}</span>
              </span>
              {agreement && (
                <span>
                  Final: <span className="font-semibold text-green-600 text-lg">{formatAmount(agreement.finalAmount)}</span>
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {deal.status}
              </span>
            </div>
          </div>
          <div>
            <QrModal dealSlug={deal.slug} dealTitle={deal.title} />
          </div>
        </div>
        
        {deal.allowNegotiation && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
            <Badge className="w-4 h-4 mr-2" />
            AI Negotiation Enabled
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Negotiation */}
          <NegotiationPanel
            deal={deal}
            agreement={agreement}
            onNegotiate={handleNegotiate}
          />

          {/* Payment */}
          <PaymentPanel
            deal={deal}
            agreement={agreement}
            payment={payment}
            onPaymentComplete={handlePaymentComplete}
          />

          {/* Settlement */}
          <SettlementPanel
            deal={deal}
            payment={payment}
            settlement={settlement}
            onSettle={handleSettle}
          />
        </div>

        {/* Right Column - Timeline & Receipt */}
        <div className="space-y-6">
          <Timeline
            deal={deal}
            agreement={agreement}
            payment={payment}
            settlement={settlement}
          />

          <ReceiptCard
            deal={deal}
            agreement={agreement}
            payment={payment}
            settlement={settlement}
          />
        </div>
      </div>
    </main>
  );
}

