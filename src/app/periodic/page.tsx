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
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-200/20 shadow-lg shadow-black/5 mx-auto max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 transition-all duration-300 ease-in-out">
            Interactive Periodic Table
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 px-4 transition-all duration-300 ease-in-out">
            Explore all 118 chemical elements with detailed information and interactive features
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Periodic Table */}
        <div className="xl:col-span-2">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 transition-all duration-300 ease-in-out">
              Periodic Table of Elements
            </h2>
            <div className="w-full bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl p-2 border border-white/10 dark:border-slate-200/10">
              <PeriodicTable />
            </div>
          </div>
        </div>

        {/* Element Information Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out">
                Element Information
              </h2>
            </div>

            {selectedElement ? (
              <div className="bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 dark:border-slate-200/10">
                <ElementCard element={selectedElement} />
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl border border-white/10 dark:border-slate-200/10">
                <div className="text-6xl mb-4 opacity-60">🧪</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out">Select an Element</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed transition-all duration-300 ease-in-out px-4">
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