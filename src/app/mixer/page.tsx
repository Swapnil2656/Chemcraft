'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load PeriodicTable for better performance
const PeriodicTable = dynamic(() => import('@/components/PeriodicTable'), {
  loading: () => <div className="bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});
import { useUser, SignInButton } from '@clerk/nextjs';
import { Plus, Minus, Zap, RotateCcw, Beaker, AlertCircle } from 'lucide-react';
import { useElementStore } from '@/stores/elementStore';
import { lookupCompound, getElementWikipediaUrl } from '@/lib/compoundLookup';
import { debounce } from '@/lib/performance';
import { Element } from '@/types/element';
import { MixingResult } from '@/types/compound';


export default function MixerPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { elements } = useElementStore();
  const [selectedElements, setSelectedElements] = useState<{ element: Element; count: number }[]>([]);
  const [mixingResult, setMixingResult] = useState<MixingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addElement = (element: Element) => {
    const existingIndex = selectedElements.findIndex(item => item.element.id === element.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedElements];
      updated[existingIndex].count += 1;
      setSelectedElements(updated);
    } else {
      setSelectedElements([...selectedElements, { element, count: 1 }]);
    }
  };

  const removeElement = (elementId: number) => {
    setSelectedElements(selectedElements.filter(item => item.element.id !== elementId));
  };

  const updateElementCount = (elementId: number, count: number) => {
    if (count <= 0) {
      removeElement(elementId);
      return;
    }
    
    const updated = selectedElements.map(item => 
      item.element.id === elementId ? { ...item, count } : item
    );
    setSelectedElements(updated);
  };

  const handleMix = debounce(async () => {
    if (selectedElements.length < 2) {
      setMixingResult({
        success: false,
        error: 'Please select at least 2 elements to mix.',
        suggestions: ['Try adding more elements', 'Experiment with different combinations']
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const elementsWithNames = selectedElements.map(item => ({
        symbol: item.element.symbol,
        name: item.element.name
      }));
      
      const compoundData = await lookupCompound(elementsWithNames);
      
      if (compoundData) {
        const properties = [
          { name: 'State', value: compoundData.properties.state, unit: '' },
          { name: 'Melting Point', value: compoundData.properties.melting_point, unit: '' },
          { name: 'Boiling Point', value: compoundData.properties.boiling_point, unit: '' },
          { name: 'Density', value: compoundData.properties.density, unit: '' }
        ].filter(prop => prop.value && prop.value !== 'Unknown');
        
        setMixingResult({
          success: true,
          compound: {
            id: `compound-${Date.now()}`,
            name: compoundData.name,
            formula: compoundData.formula,
            elements: selectedElements.map(item => ({ element: item.element.symbol, count: item.count })),
            type: 'compound' as any,
            properties,
            description: `${compoundData.name} (${compoundData.formula})`,
            uses: compoundData.uses,
            phase: compoundData.properties.state || 'unknown' as any,
            color: 'unknown',
            learnMore: compoundData.links.wikipedia,
            pubchemUrl: compoundData.links.pubchem
          }
        });
      } else {
        const elementLinks = elementsWithNames.map(el => getElementWikipediaUrl(el.name));
        setMixingResult({
          success: false,
          error: 'No stable compound known',
          suggestions: elementLinks.map(link => `Learn about elements: ${link}`)
        });
      }
    } catch (error) {
      console.error('Mixing error:', error);
      setMixingResult({
        success: false,
        error: 'Error looking up compound',
        suggestions: ['Please try again']
      });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const resetMixer = () => {
    setSelectedElements([]);
    setMixingResult(null);
  };

  const popularElements = elements.slice(0, 10);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-900 dark:text-slate-100 transition-colors duration-300">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30 px-4">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-12 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out">Sign in to use the Element Mixer</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6 transition-all duration-300 ease-in-out">You need to be signed in to mix elements and create compounds.</p>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-600/40 dark:to-purple-600/40 backdrop-blur-sm border border-white/30 dark:border-slate-200/30 text-slate-800 dark:text-slate-100 px-8 py-3 rounded-2xl hover:from-blue-500/50 hover:to-purple-500/50 dark:hover:from-blue-600/60 dark:hover:to-purple-600/60 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-blue-500/20">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-200/20 shadow-lg shadow-black/5 mx-auto max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 transition-all duration-300 ease-in-out">
            Element Mixer
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 px-4 transition-all duration-300 ease-in-out">
            Combine elements to create compounds and discover chemistry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Element Selection */}
        <div className="xl:col-span-2">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 transition-all duration-300 ease-in-out">
              Select Elements
            </h2>
            <div className="w-full bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl p-2 border border-white/10 dark:border-slate-200/10">
              <PeriodicTable onElementClick={addElement} />
            </div>
          </div>
        </div>

        {/* Mixing Area */}
        <div className="xl:col-span-1">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out">
                Mixing Zone
              </h2>
              <button
                onClick={resetMixer}
                className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1 md:py-2 bg-white/10 dark:bg-slate-700/50 backdrop-blur-sm border border-white/20 dark:border-slate-200/20 hover:bg-white/20 dark:hover:bg-slate-600/60 rounded-2xl text-sm md:text-base text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out shadow-md"
              >
                <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Selected Elements */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-slate-100 mb-2 md:mb-3 transition-colors duration-300">
                Selected Elements
              </h3>
              {selectedElements.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-gray-500 dark:text-slate-400 transition-colors duration-300">
                  <Beaker className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No elements selected</p>
                  <p className="text-xs md:text-sm">Click on elements to add them to the mixer</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {selectedElements.map(({ element, count }) => (
                    <div
                      key={element.id}
                      className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div 
                          className="w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-white font-bold text-sm md:text-base element-symbol"
                          style={{ '--element-color': element.color } as React.CSSProperties}
                        >
                          {element.symbol}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100 text-sm md:text-base transition-colors duration-300">
                            {element.name}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-slate-300 transition-colors duration-300">
                            Atomic Number: {element.atomicNumber}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                          onClick={() => updateElementCount(element.id, count - 1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded text-gray-900 dark:text-slate-100 transition-colors duration-300"
                          title={`Decrease ${element.name} count`}
                          aria-label={`Decrease ${element.name} count`}
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <span className="font-medium text-gray-900 dark:text-slate-100 min-w-[1.5rem] md:min-w-[2rem] text-center text-sm md:text-base transition-colors duration-300">
                          {count}
                        </span>
                        <button
                          onClick={() => updateElementCount(element.id, count + 1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded text-gray-900 dark:text-slate-100 transition-colors duration-300"
                          title={`Increase ${element.name} count`}
                          aria-label={`Increase ${element.name} count`}
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <button
                          onClick={() => removeElement(element.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded ml-1 md:ml-2 transition-colors duration-300"
                          title={`Remove ${element.name} from mixture`}
                          aria-label={`Remove ${element.name} from mixture`}
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mix Button */}
            <div className="mb-4 md:mb-6">
              <button
                onClick={handleMix}
                disabled={selectedElements.length < 2 || isLoading}
                className="w-full flex items-center justify-center space-x-2 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm md:text-base transition-colors duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Mixing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Mix Elements</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {mixingResult && (
              <div className="border-t border-gray-200 dark:border-slate-600 pt-6 transition-colors duration-300">
                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-slate-100 mb-3 md:mb-4 transition-colors duration-300">
                  Mixing Result
                </h3>
                
                {mixingResult.success ? (
                  <div className="space-y-4">
                    {mixingResult.compound && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 md:p-4 transition-colors duration-300">
                        <div className="flex items-center space-x-2 mb-2 md:mb-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Beaker className="h-3 w-3 md:h-5 md:w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-semibold text-green-900 dark:text-green-100 transition-colors duration-300">
                              {mixingResult.compound.name}
                            </h4>
                            <p className="text-green-700 dark:text-green-300 font-mono text-sm md:text-base transition-colors duration-300">
                              {mixingResult.compound.formula}
                            </p>
                          </div>
                        </div>
                        <p className="text-green-800 dark:text-green-200 mb-2 md:mb-3 text-sm md:text-base transition-colors duration-300">
                          {mixingResult.compound.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm mb-3 md:mb-4">
                          <div>
                            <strong>Formula:</strong> <span className="font-mono">{mixingResult.compound.formula}</span>
                          </div>
                          <div>
                            <strong>Type:</strong> {mixingResult.compound.type}
                          </div>
                          <div className="sm:col-span-2">
                            <strong>Phase:</strong> {mixingResult.compound.phase}
                          </div>
                        </div>
                        {mixingResult.compound.properties && mixingResult.compound.properties.length > 0 && (
                          <div className="mb-3 md:mb-4">
                            <h5 className="font-medium text-green-900 dark:text-green-100 mb-1 md:mb-2 text-sm md:text-base transition-colors duration-300">Properties:</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                              {mixingResult.compound.properties.map((prop, index) => (
                                <div key={index}>
                                  <strong>{prop.name}:</strong> {prop.value} {prop.unit}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {(mixingResult.compound.learnMore || mixingResult.compound.pubchemUrl) && (
                            <div className="border-t border-green-200 dark:border-green-700 pt-3 md:pt-4 transition-colors duration-300">
                            <h5 className="font-medium text-green-900 dark:text-green-100 mb-1 md:mb-2 text-sm md:text-base transition-colors duration-300">Learn More:</h5>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {mixingResult.compound.learnMore && (
                                <a
                                  href={mixingResult.compound.learnMore}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2 md:px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs md:text-sm hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-300"
                                >
                                  Wikipedia
                                </a>
                              )}
                              {mixingResult.compound.pubchemUrl && (
                                <a
                                  href={mixingResult.compound.pubchemUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs md:text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-300"
                                >
                                  PubChem
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {mixingResult.reaction && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors duration-300">
                        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 transition-colors duration-300">
                          Chemical Reaction
                        </h4>
                        <p className="font-mono text-blue-800 dark:text-blue-200 transition-colors duration-300">
                          {mixingResult.reaction.equation}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 transition-colors duration-300">
                          Type: {mixingResult.reaction.type}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-300">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                      <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 transition-colors duration-300">
                        Mixing Failed
                      </h4>
                    </div>
                    <p className="text-red-800 dark:text-red-200 mb-3 transition-colors duration-300">
                      {mixingResult.error}
                    </p>
                    {mixingResult.suggestions && (
                      <div>
                        <h5 className="font-medium text-red-900 dark:text-red-100 mb-2 transition-colors duration-300">
                          Suggestions:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 transition-colors duration-300">
                          {mixingResult.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}