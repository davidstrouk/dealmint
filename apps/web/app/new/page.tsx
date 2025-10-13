'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins } from 'lucide-react';

export default function NewDealPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    allowNegotiation: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (!validate()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          allowNegotiation: formData.allowNegotiation,
          creatorAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deal');
      }

      const data = await response.json();
      router.push(`/d/${data.slug}`);
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Failed to create deal. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Deal</h1>
          <p className="text-gray-400">
            Set up your deal and let AI agents negotiate the best terms
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center space-y-4 py-8">
                <p className="text-gray-600">Connect your wallet to create a deal</p>
                <ConnectButton />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <Input
                  label="Deal Title"
                  placeholder="e.g., Enterprise Software License Q4 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title}
                  required
                />

                {/* Amount */}
                <Input
                  label="Amount (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 1000.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  error={errors.amount}
                  required
                />

                {/* Allow Negotiation Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowNegotiation}
                      onChange={(e) => setFormData({ ...formData, allowNegotiation: e.target.checked })}
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Allow AI Negotiation</span>
                      <p className="text-sm text-gray-600">
                        Enable AI agents to negotiate discounts and better terms
                      </p>
                    </div>
                  </label>
                </div>

                {/* Creator Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Your Address (Creator)</div>
                  <div className="font-mono text-sm break-all">{address}</div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isCreating}
                  isLoading={isCreating}
                  className="w-full"
                  size="lg"
                >
                  Mint Deal
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-2">What happens next?</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>✓ Your deal will be created on-chain</li>
              <li>✓ Buyers can view and negotiate terms</li>
              <li>✓ Payment in PYUSD on Sepolia</li>
              <li>✓ Cross-chain settlement via Avail</li>
            </ul>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-2">How negotiation works</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• Early payment discount (up to 10%)</li>
              <li>• Bulk purchase discount (5%)</li>
              <li>• Time-based urgency bonuses</li>
              <li>• AP2 mandate generation</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

