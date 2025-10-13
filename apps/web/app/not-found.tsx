import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-2xl text-gray-300">Deal Not Found</p>
        <p className="text-gray-400">
          The deal you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

