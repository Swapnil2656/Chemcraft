'use client';

import dynamic from 'next/dynamic';
import ElementCard from '@/components/ElementCard';
import { useElementStore } from '@/stores/elementStore';

// Lazy load PeriodicTable for better performance
const PeriodicTable = dynamic(() => import('@/components/PeriodicTable'), {
  loading: () => <div className="bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});

export default function PeriodicTablePage() {
  const { selectedElement } = useElementStore();

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
          Interactive Periodic Table
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
          Explore all 118 chemical elements with detailed information and interactive features
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Periodic Table */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg p-3 md:p-4 lg:p-6 border border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
              Periodic Table of Elements
            </h2>
            <div className="w-full">
              <PeriodicTable />
            </div>
          </div>
        </div>

        {/* Element Information Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg p-3 md:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Element Information
              </h2>
            </div>

            {selectedElement ? (
              <ElementCard element={selectedElement} />
            ) : (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <div className="text-6xl mb-4">🧪</div>
                <h3 className="text-xl font-semibold mb-3">Select an Element</h3>
                <p className="text-gray-600 leading-relaxed">
                  Click on any element in the periodic table to view detailed information including properties, uses, and discovery history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}