'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { XCircle, RefreshCcw } from 'lucide-react';
import { Suspense } from 'react';

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tran_id = searchParams.get('tran_id');
  const status = searchParams.get('status');
  
  const isCancelled = status === 'cancelled';

  return (
    <Card className="max-w-lg w-full text-center py-12 px-8">
      <div className="flex justify-center mb-6">
        <div className="bg-red-100 p-4 rounded-full">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
        {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
      </h1>
      <p className="text-slate-500 mb-8 text-lg">
        {isCancelled 
          ? 'You cancelled the payment process. Your booking has not been confirmed.'
          : 'We could not process your payment at this time. Please try again or use a different payment method.'}
      </p>
      
      {tran_id && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-sm text-slate-600 font-mono">
          Transaction ID: {tran_id}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => router.push('/centers')} className="w-full sm:w-auto">
          <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
        <Button variant="secondary" onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
}

export default function PaymentFailPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Suspense fallback={<div className="animate-pulse w-96 h-96 bg-white rounded-2xl shadow-sm border border-slate-100"></div>}>
        <FailContent />
      </Suspense>
    </div>
  );
}
