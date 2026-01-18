'use client';

import React, { Suspense } from 'react';
import NexusPrimeEngine from '../../nexus/NexusPrimeEngine';
import { Loader2 } from 'lucide-react';

export default function NexusGatewayPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Suspense is required because NexusPrimeEngine uses useSearchParams */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-black">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      }>
        <NexusPrimeEngine />
      </Suspense>
    </main>
  );
}
