'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Deal, Agreement, Payment, Settlement } from '@dealmint/core';

interface TimelineProps {
  deal: Deal;
  agreement?: Agreement | null;
  payment?: Payment | null;
  settlement?: Settlement | null;
}

interface TimelineStep {
  label: string;
  status: 'complete' | 'active' | 'pending';
  timestamp?: Date;
}

export function Timeline({ deal, agreement, payment, settlement }: TimelineProps) {
  const steps: TimelineStep[] = [
    {
      label: 'Deal Created',
      status: 'complete',
      timestamp: deal.createdAt,
    },
    {
      label: deal.allowNegotiation ? 'Mandate Created' : 'Terms Set',
      status: agreement ? 'complete' : deal.allowNegotiation ? 'pending' : 'complete',
      timestamp: agreement?.createdAt,
    },
    {
      label: 'PYUSD Payment',
      status: payment ? 'complete' : agreement || !deal.allowNegotiation ? 'active' : 'pending',
      timestamp: payment?.createdAt,
    },
    {
      label: 'Cross-Chain Settlement',
      status: settlement
        ? settlement.status === 'completed'
          ? 'complete'
          : 'active'
        : payment
        ? 'active'
        : 'pending',
      timestamp: settlement?.status === 'completed' ? settlement.updatedAt : undefined,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transaction Timeline</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {step.status === 'complete' ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : step.status === 'active' ? (
                <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    'font-medium',
                    step.status === 'complete'
                      ? 'text-gray-900'
                      : step.status === 'active'
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                {step.timestamp && (
                  <span className="text-xs text-gray-500">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Additional info for active settlement */}
              {index === 3 && settlement && step.status === 'active' && (
                <div className="mt-2 text-sm text-gray-600">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-medium text-yellow-900">
                      Status: {settlement.status}
                    </p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Intent ID: {settlement.intentId}
                    </p>
                  </div>
                </div>
              )}

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8 ml-3 mt-2',
                    step.status === 'complete' ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

