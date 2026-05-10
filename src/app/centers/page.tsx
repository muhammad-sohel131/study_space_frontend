'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import Image from 'next/image';

interface Center {
  id: string;
  name: string;
  location: string;
  openingTime: string;
  closingTime: string;
  coverImage?: string;
}

export default function CentersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const { data, isLoading, error } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: Center[] }>(GET_CENTERS);
      return response.centers;
    },
  });

  const locations = useMemo(() => {
    if (!data) return ['All Locations'];
    const locs = Array.from(new Set(data.map((c) => c.location)));
    return ['All Locations', ...locs.sort()];
  }, [data]);

  const filteredCenters = useMemo(() => {
    if (!data) return [];
    return data.filter((center) => {
      const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          center.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === 'All Locations' || center.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [data, searchQuery, selectedLocation]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Error loading centers. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="/images/centers-banner.png"
          alt="Study Centers Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Premium Locations
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Find Your Perfect <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-200">
                Focus Zone
              </span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed max-w-2xl">
              Discover distraction-free environments designed for deep work and academic excellence. 
              Our centers offer premium amenities and quiet atmospheres.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search centers by name or city..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:w-64 relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none appearance-none bg-white transition-all"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredCenters.length} {filteredCenters.length === 1 ? 'Center' : 'Centers'} Found
          </h2>
        </div>

        {filteredCenters.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {filteredCenters.map((center) => (
              <Card key={center.id} className="group flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-slate-200 hover:border-violet-200 overflow-hidden">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                  {center.coverImage ? (
                    <img src={center.coverImage} alt={center.name} className="absolute inset-0 w-full h-full object-cover z-0" />
                  ) : (
                    <MapPin className="w-12 h-12 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="px-2 py-1 rounded-md bg-violet-600 text-white text-xs font-bold tracking-wider uppercase">
                      Active
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                    {center.name}
                  </h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-violet-500" />
                      <span className="text-sm font-medium">{center.location}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-violet-500" />
                      <span className="text-sm font-medium">
                        {center.openingTime} - {center.closingTime}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-auto bg-slate-900 hover:bg-violet-600 text-white transition-all duration-300"
                    onClick={() => router.push(`/centers/${center.id}/book`)}
                  >
                    Book a Seat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No centers found</h3>
            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
