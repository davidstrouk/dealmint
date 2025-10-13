import { notFound } from 'next/navigation';
import { prisma } from '@dealmint/prisma';
import { Navbar } from '@/components/navbar';
import { DealCheckout } from './deal-checkout';

interface DealPageProps {
  params: {
    slug: string;
  };
}

async function getDeal(slug: string) {
  const deal = await prisma.deal.findUnique({
    where: { slug },
    include: {
      agreement: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      settlements: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return deal;
}

export default async function DealPage({ params }: DealPageProps) {
  const deal = await getDeal(params.slug);

  if (!deal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      <Navbar />
      <DealCheckout
        deal={deal}
        agreement={deal.agreement}
        payment={deal.payments[0] || null}
        settlement={deal.settlements[0] || null}
      />
    </div>
  );
}

