'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Plus, Minus, Zap, RotateCcw, Beaker, AlertCircle, Atom, FlaskConical } from 'lucide-react';
import { useElementStore } from '@/stores/elementStore';
import { Element } from '@/types/element';
import { MixingResult } from '@/types/compound';

// Lazy load PeriodicTable for better performance
const PeriodicTable = dynamic(() => import('@/components/PeriodicTable'), {
  loading: () => <div className="bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});

// Dynamic imports for heavy modules (loaded on demand)
const loadCompoundLookup = () => import('@/lib/compoundLookup');
const loadPerformance = () => import('@/lib/performance');
const loadReactivityData = () => import('@/data/reactivityData');
const loadChemCraftAI = () => import('@/lib/chemCraftAI');


export default function MixerPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { elements } = useElementStore();
  const [selectedElements, setSelectedElements] = useState<{ element: Element; count: number }[]>([]);
  const [mixingResult, setMixingResult] = useState<MixingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reactivityMode, setReactivityMode] = useState(false);
  const [elementForReactivity, setElementForReactivity] = useState<Element | null>(null);

  const addElement = (element: Element) => {
    // Handle reactivity mode selection
    if (reactivityMode) {
      if (elementForReactivity?.id === element.id) {
        // Deselect if clicking the same element - keep Smart Mode active
        setElementForReactivity(null);
      } else if (!elementForReactivity) {
        // First element selection in reactivity mode
        setElementForReactivity(element);
      } else {
        // Second element selection - check if they can react
        const reactivePartners = getReactivePartners(elementForReactivity.symbol);
        if (reactivePartners.includes(element.symbol)) {
          // Elements can react - add both to mixer, keep Smart Mode active
          addElementToMixer(elementForReactivity);
          addElementToMixer(element);
          setElementForReactivity(null); // Clear selection but keep Smart Mode on
        } else {
          // Elements cannot react - show feedback and keep Smart Mode active
          setMixingResult({
            success: false,
            error: `${elementForReactivity.name} and ${element.name} do not react under normal conditions.`,
            suggestions: [`Try selecting a different element that can react with ${elementForReactivity.name}`]
          });
          setElementForReactivity(element); // Set new element for next selection
        }
      }
    } else {
      // Normal mode - just add to mixer
      addElementToMixer(element);
    }
  };

  const addElementToMixer = (element: Element) => {
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
      // Use AI prediction with element counts
      const elementsWithCounts = selectedElements.map(item => ({
        symbol: item.element.symbol,
        count: item.count
      }));
      
      try {
        const aiPrediction = await chemCraftAI.predictCompound(elementsWithCounts);
        
        if (aiPrediction.will_react) {
          const properties = [
            { name: 'State', value: aiPrediction.properties?.state || 'unknown', unit: '' },
            { name: 'Type', value: aiPrediction.properties?.type || 'unknown', unit: '' },
            { name: 'Color', value: aiPrediction.properties?.color || 'unknown', unit: '' }
          ].filter(prop => prop.value && prop.value !== 'unknown');

          const elementNames = selectedElements.map(item => item.element.name).join('-');
          
          setMixingResult({
            success: true,
            compound: {
              id: `compound-${Date.now()}`,
              name: aiPrediction.name || `${elementNames} compound`,
              formula: aiPrediction.formula || elementsWithCounts.map(e => `${e.symbol}${e.count > 1 ? e.count : ''}`).join(''),
              elements: selectedElements.map(item => ({ element: item.element.symbol, count: item.count })),
              type: 'compound' as any,
              properties,
              description: `${aiPrediction.name || 'Predicted compound'} (${aiPrediction.formula || 'Formula predicted'})`,
              uses: aiPrediction.uses || ['Chemical synthesis', 'Research applications'],
              phase: aiPrediction.properties?.state || 'unknown' as any,
              color: aiPrediction.properties?.color || 'unknown',
              confidence: aiPrediction.confidence,
              source: aiPrediction.source,
              rule_applied: aiPrediction.rule_applied,
              safety_warnings: aiPrediction.warnings
            }
          });
          return;
        } else {
          // AI says no reaction
          const elementNames = selectedElements.map(item => `${item.count > 1 ? item.count + ' ' : ''}${item.element.name}`).join(' + ');
          
          setMixingResult({
            success: false,
            error: aiPrediction.reason || `${elementNames} do not react under normal conditions.`,
            suggestions: [
              'Try using the Smart Mode to find reactive combinations',
              'Consider different element ratios',
              'Learn about chemical reactivity patterns',
              aiPrediction.note || 'Check the periodic table for better combinations'
            ],
            confidence: aiPrediction.confidence,
            source: aiPrediction.source
          });
          return;
        }
      } catch (aiError) {
        console.warn('AI prediction failed, falling back to traditional lookup:', aiError);
        // Continue to fallback
      }

      // Fallback to traditional compound lookup
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
            pubchemUrl: compoundData.links.pubchem,
            source: 'database'
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
    setElementForReactivity(null);
    // Keep Smart Mode active - don't reset reactivityMode
  };

  const toggleReactivityMode = () => {
    setReactivityMode(!reactivityMode);
    setElementForReactivity(null);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Element Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10 transition-all duration-300 ease-in-out">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out">
                Select Elements
              </h2>
              <button
                onClick={toggleReactivityMode}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  reactivityMode
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400/30'
                    : 'bg-white/10 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-200/20 hover:bg-white/20 dark:hover:bg-slate-600/60'
                }`}
              >
                <Atom className="h-4 w-4" />
                <span className="hidden xs:inline">Smart Mode</span>
                <span className="xs:hidden">Smart</span>
                {reactivityMode && <span className="text-xs hidden sm:inline">(Active)</span>}
              </button>
            </div>
            {reactivityMode && (
              <div className="mb-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Smart Reactivity Mode Active
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {elementForReactivity 
                    ? `Selected: ${elementForReactivity.name}. Click on a highlighted element to see if they react! Smart Mode stays active.`
                    : 'Click on an element to see which elements can react with it. Reactive elements will be highlighted in blue. Smart Mode stays on until you turn it off.'
                  }
                </p>
              </div>
            )}
            <div className="w-full bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl p-2 border border-white/10 dark:border-slate-200/10">
              <PeriodicTable 
                onElementClick={addElement} 
                selectedElementForReactivity={elementForReactivity}
                showReactivityHighlighting={reactivityMode}
              />
            </div>
            {reactivityMode && (
              <div className="mt-4 grid grid-cols-1 xs:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-2 p-2 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/30 dark:border-yellow-700/30">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded ring-1 sm:ring-2 ring-yellow-400 shadow-sm flex-shrink-0"></div>
                  <span className="text-yellow-800 dark:text-yellow-200 text-xs">Selected</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded ring-1 sm:ring-2 ring-blue-400 shadow-sm animate-pulse flex-shrink-0"></div>
                  <span className="text-blue-800 dark:text-blue-200 text-xs">Can React</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-gray-50/50 dark:bg-gray-900/20 rounded-lg border border-gray-200/30 dark:border-gray-700/30">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded opacity-40 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Cannot React</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mixing Area */}
        <div className="lg:col-span-1">
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
                        <div className="relative">
                          <div 
                            className="w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-white font-bold text-sm md:text-base"
                            style={{ backgroundColor: element.color }}
                          >
                            {element.symbol}
                          </div>
                          {reactivityMode && selectedElements.length > 1 && (
                            <div className="absolute -top-1 -right-1">
                              {canElementsReact(element.symbol, selectedElements.find(el => el.element.id !== element.id)?.element.symbol || '') ? (
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Can react" />
                              ) : (
                                <div className="w-3 h-3 bg-red-500 rounded-full" title="Cannot react" />
                              )}
                            </div>
                          )}
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
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <div className="flex items-center space-x-2">
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
                          {(mixingResult.compound.confidence || mixingResult.compound.source) && (
                            <div className="text-right">
                              {mixingResult.compound.confidence && (
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  {Math.round(mixingResult.compound.confidence * 100)}% confidence
                                </div>
                              )}
                              {mixingResult.compound.source && (
                                <div className="text-xs text-green-500 dark:text-green-500 capitalize">
                                  {mixingResult.compound.source.replace('_', ' ')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-green-800 dark:text-green-200 mb-2 md:mb-3 text-sm md:text-base transition-colors duration-300">
                          {mixingResult.compound.description}
                        </p>
                        {mixingResult.compound.rule_applied && (
                          <div className="mb-3 p-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-700/30 rounded">
                            <div className="text-xs text-blue-700 dark:text-blue-300">
                              <strong>AI Rule Applied:</strong> {mixingResult.compound.rule_applied}
                            </div>
                          </div>
                        )}
                        {mixingResult.compound.safety_warnings && mixingResult.compound.safety_warnings.length > 0 && (
                          <div className="mb-3 p-2 bg-red-50/50 dark:bg-red-900/20 border border-red-200/30 dark:border-red-700/30 rounded">
                            <div className="text-xs text-red-700 dark:text-red-300">
                              <strong>Safety Warnings:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {mixingResult.compound.safety_warnings.map((warning, idx) => (
                                  <li key={idx}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 transition-colors duration-300">
                          Mixing Failed
                        </h4>
                      </div>
                      {(mixingResult.confidence || mixingResult.source) && (
                        <div className="text-right">
                          {mixingResult.confidence && (
                            <div className="text-xs text-red-600 dark:text-red-400">
                              {Math.round(mixingResult.confidence * 100)}% confidence
                            </div>
                          )}
                          {mixingResult.source && (
                            <div className="text-xs text-red-500 dark:text-red-500 capitalize">
                              {mixingResult.source.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      )}
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

      {/* Educational Section */}
      <div className="mt-8">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-200/20 shadow-xl shadow-black/10">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            How Smart Mode Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 sm:p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">Highly Reactive Elements</h3>
              <p className="text-blue-700 dark:text-blue-300 text-xs mb-2">
                Alkali metals (Na, K, Li) and halogens (F, Cl, Br, I) react with many elements.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">Na</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">Cl</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">F</span>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">Common Reactions</h3>
              <p className="text-green-700 dark:text-green-300 text-xs mb-2">
                Hydrogen + Oxygen → Water, Sodium + Chlorine → Salt
              </p>
              <div className="text-xs font-mono text-green-600 dark:text-green-400 space-y-1">
                <div>H + O → H₂O</div>
                <div>Na + Cl → NaCl</div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-900/20 rounded-lg border border-gray-200/30 dark:border-gray-700/30 sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm sm:text-base">Noble Gases</h3>
              <p className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                He, Ne, Ar, Kr, Xe, Rn rarely react due to stable electron configuration.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">He</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">Ne</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">Ar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}