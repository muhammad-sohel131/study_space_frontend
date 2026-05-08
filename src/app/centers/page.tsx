'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock } from 'lucide-react';

interface Center {
 id: string;
 name: string;
 location: string;
 openingTime: string;
 closingTime: string;
}

export default function CentersPage() {
 const router = useRouter();
 const { data, isLoading, error } = useQuery({
 queryKey: ['centers'],
 queryFn: async () => {
 const response = await graphqlClient.request<{ centers: Center[] }>(GET_CENTERS);
 return response.centers;
 },
 });

 if (isLoading) {
 return (
 <div className="flex-1 p-8 flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="flex-1 p-8">
 <div className="bg-red-50 text-red-600 p-4 rounded-xl">Error loading centers</div>
 </div>
 );
 }

 return (
 <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
 <div className="mb-10 text-center">
 <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Our Study Centers</h1>
 <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
 Find the perfect environment for your focus and productivity.
 </p>
 </div>

 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
 {data?.map((center) => (
 <Card key={center.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
 <div className="h-48 bg-slate-100 rounded-t-xl -mx-6 -mt-6 mb-6 flex items-center justify-center relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-purple-600/20 mix-blend-multiply" />
 <MapPin className="w-16 h-16 text-slate-300 relative z-10" />
 </div>
 <div className="flex-1">
 <h3 className="text-xl font-bold text-slate-900 mb-2">{center.name}</h3>
 <div className="space-y-2 mb-6">
 <div className="flex items-center text-slate-600">
 <MapPin className="w-4 h-4 mr-2" />
 <span className="text-sm">{center.location}</span>
 </div>
 <div className="flex items-center text-slate-600">
 <Clock className="w-4 h-4 mr-2" />
 <span className="text-sm">
 {center.openingTime} - {center.closingTime}
 </span>
 </div>
 </div>
 </div>
 <Button
 className="w-full mt-auto"
 onClick={() => router.push(`/centers/${center.id}/book`)}
 >
 Book a Seat
 </Button>
 </Card>
 ))}
 </div>
 </div>
 );
}
