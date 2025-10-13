import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, MessageSquare, Wallet, ArrowRightLeft } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-primary p-6 rounded-3xl shadow-2xl">
              <Coins className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">
              Deal<span className="text-primary">Mint</span>
            </h1>
            <p className="text-2xl text-gray-300 font-medium">
              Negotiate, mint the mandate, and settle anywhere.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A negotiation-first, on-chain checkout app powered by PYUSD payments and Avail Nexus cross-chain settlement.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link href="/new">
              <Button size="lg" className="text-lg px-8 py-4">
                Mint a Deal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a
              href="https://github.com/yourusername/dealmint"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8 text-primary" />}
            title="AI Agent Negotiation"
            description="Agents negotiate using A2A protocol to find the best terms for both parties."
          />
          <FeatureCard
            icon={<Coins className="w-8 h-8 text-primary" />}
            title="AP2 Mandates"
            description="Generate standardized payment mandates following Agent Payments Protocol."
          />
          <FeatureCard
            icon={<Wallet className="w-8 h-8 text-primary" />}
            title="PYUSD Payments"
            description="Pay with PayPal's stablecoin on Ethereum Sepolia testnet."
          />
          <FeatureCard
            icon={<ArrowRightLeft className="w-8 h-8 text-primary" />}
            title="Cross-Chain Settlement"
            description="Bridge to Base via Avail Nexus for seamless multi-chain execution."
          />
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              step="1"
              title="Create Deal"
              description="Set up your deal with title, amount, and negotiation preferences."
            />
            <StepCard
              step="2"
              title="AI Negotiation"
              description="Agents negotiate terms and generate an AP2 payment mandate."
            />
            <StepCard
              step="3"
              title="Pay with PYUSD"
              description="Complete the payment using PYUSD on Ethereum."
            />
            <StepCard
              step="4"
              title="Settle Cross-Chain"
              description="Bridge funds to Base via Avail Nexus integration."
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Built For ETHOnline 2025</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <TechBadge>PayPal USD (PYUSD)</TechBadge>
            <TechBadge>Avail Nexus</TechBadge>
            <TechBadge>A2A Protocol</TechBadge>
            <TechBadge>AP2</TechBadge>
            <TechBadge>Next.js 14</TechBadge>
            <TechBadge>Wagmi + Viem</TechBadge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            Built with 💚 for ETHOnline 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold shadow-lg">
        {step}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-medium">
      {children}
    </div>
  );
}

