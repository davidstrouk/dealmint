'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MessageSquare, CheckCircle } from 'lucide-react';
import type { Deal, Agreement } from '@dealmint/core';

interface NegotiationPanelProps {
  deal: Deal;
  agreement?: Agreement | null;
  onNegotiate: () => Promise<void>;
}

export function NegotiationPanel({ deal, agreement, onNegotiate }: NegotiationPanelProps) {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleNegotiate = async () => {
    setIsNegotiating(true);
    try {
      await onNegotiate();
    } finally {
      setIsNegotiating(false);
    }
  };

  if (!deal.allowNegotiation) {
    return null;
  }

  const parsedAgreement = agreement
    ? {
        mandate: JSON.parse(agreement.mandateJson),
        transcript: JSON.parse(agreement.a2aTranscript),
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span>AI Agent Negotiation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!agreement ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Let our AI agents negotiate the best terms for this deal. They'll apply early payment and bulk discounts automatically.
            </p>
            <Button
              onClick={handleNegotiate}
              isLoading={isNegotiating}
              className="w-full"
            >
              Run Negotiation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Negotiation Complete</span>
            </div>

            {/* Negotiation Results */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Amount:</span>
                <span className="font-semibold">${deal.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final Amount:</span>
                <span className="font-semibold text-primary">${agreement.finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-green-600">
                  ${(deal.amount - agreement.finalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* A2A Transcript */}
            <div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-primary hover:underline text-sm"
              >
                {showTranscript ? 'Hide' : 'Show'} A2A Conversation Transcript
              </button>
              {showTranscript && parsedAgreement && (
                <div className="mt-4 space-y-2">
                  {parsedAgreement.transcript.messages.map((msg: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.from === 'seller-agent'
                          ? 'bg-blue-50 text-blue-900'
                          : 'bg-green-50 text-green-900'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">{msg.from}</div>
                      <div className="text-sm">{msg.content.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AP2 Mandate */}
            <div>
              <details className="cursor-pointer">
                <summary className="text-primary hover:underline text-sm">
                  View AP2 Payment Mandate
                </summary>
                <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(parsedAgreement?.mandate, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

