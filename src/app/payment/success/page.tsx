'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const tran_id = searchParams.get('tran_id');

 return (
 <Card className="max-w-lg w-full text-center py-12 px-8">
 <div className="flex justify-center mb-6">
 <div className="bg-green-100 p-4 rounded-full">
 <CheckCircle2 className="w-16 h-16 text-green-600" />
 </div>
 </div>
 
 <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Successful!</h1>
 <p className="text-slate-500 mb-8 text-lg">
 Your booking has been confirmed and the payment was processed successfully.
 </p>
 
 {tran_id && (
 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-sm text-slate-600 font-mono">
 Transaction ID: {tran_id}
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
 View Dashboard
 </Button>
 <Button variant="secondary" onClick={() => router.push('/centers')} className="w-full sm:w-auto">
 Book Another Seat <ArrowRight className="w-4 h-4 ml-2" />
 </Button>
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
