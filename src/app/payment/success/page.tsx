'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tran_id = searchParams.get('tran_id') || '';

  const isBorrow = tran_id.startsWith('BOR_');
  const isOrder = tran_id.startsWith('ORD_');

  return (
    <Card className="max-w-lg w-full text-center py-12 px-8 rounded-3xl shadow-lg border border-slate-200">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-100 p-4 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
        {isBorrow ? 'Book Rental Payment Successful!' : isOrder ? 'Book Purchase Successful!' : 'Payment Successful!'}
      </h1>
      <p className="text-slate-600 mb-8 text-base">
        {isBorrow
          ? 'Your textbook rental payment was processed via SSLCommerz. Please visit your center reception desk to collect your physical book.'
          : isOrder
          ? 'Your textbook purchase has been confirmed. You can track and view your order in your dashboard.'
          : 'Your seat booking has been confirmed and the payment was processed successfully.'}
      </p>

      {tran_id && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-8 text-xs text-slate-600 font-mono">
          Transaction ID: {tran_id}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isBorrow ? (
          <>
            <Button onClick={() => router.push('/dashboard?tab=borrows')} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 font-bold">
              View Borrowed Books
            </Button>
            <Button variant="secondary" onClick={() => router.push('/library')} className="w-full sm:w-auto font-bold">
              Browse Library <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </>
        ) : isOrder ? (
          <>
            <Button onClick={() => router.push('/dashboard?tab=orders')} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 font-bold">
              View My Orders
            </Button>
            <Button variant="secondary" onClick={() => router.push('/library')} className="w-full sm:w-auto font-bold">
              Browse Library <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push('/dashboard?tab=bookings')} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 font-bold">
              View Dashboard
            </Button>
            <Button variant="secondary" onClick={() => router.push('/centers')} className="w-full sm:w-auto font-bold">
              Book Another Seat <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Suspense fallback={<div className="animate-pulse w-96 h-96 bg-white rounded-2xl shadow-sm border border-slate-100"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
