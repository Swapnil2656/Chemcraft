'use client';

import { useEffect } from 'react';
import { useElementStore } from '@/stores/elementStore';
import { getElementPosition, getElementCategoryColor } from '@/lib/elementUtils';
import { getReactivePartners } from '@/data/reactivityData';
import { Element } from '@/types/element';

interface PeriodicTableProps {
  onElementClick?: (element: Element) => void;
  selectedElementForReactivity?: Element | null;
  showReactivityHighlighting?: boolean;
}

export default function PeriodicTable({ 
  onElementClick, 
  selectedElementForReactivity = null, 
  showReactivityHighlighting = false 
}: PeriodicTableProps = {}) {
  const { elements, selectedElement, setSelectedElement } = useElementStore();

  // Get reactive partners for the selected element
  const reactivePartners = selectedElementForReactivity 
    ? getReactivePartners(selectedElementForReactivity.symbol)
    : [];

  const handleElementClick = (element: Element) => {
    if (onElementClick) {
      onElementClick(element);
    } else {
      setSelectedElement(element);
    }
  };

  const renderElement = (element: Element) => {
    const position = getElementPosition(element);
    const isSelected = selectedElement?.id === element.id;
    const isSelectedForReactivity = selectedElementForReactivity?.id === element.id;
    const isReactivePartner = showReactivityHighlighting && 
      selectedElementForReactivity && 
      reactivePartners.includes(element.symbol);
    const isNonReactive = showReactivityHighlighting && 
      selectedElementForReactivity && 
      !isSelectedForReactivity && 
      !reactivePartners.includes(element.symbol);

    const getElementClasses = () => {
      let baseClasses = 'element-cell group cursor-pointer transition-all duration-300 ease-in-out';
      
      if (isSelectedForReactivity) {
        baseClasses += ' ring-4 ring-yellow-400 scale-105 shadow-lg shadow-yellow-400/30';
      } else if (isReactivePartner) {
        baseClasses += ' ring-4 ring-blue-400 scale-105 shadow-lg shadow-blue-400/30 animate-pulse hover:ring-cyan-400';
      } else if (isNonReactive) {
        baseClasses += ' opacity-40 pointer-events-none scale-95';
      } else if (isSelected) {
        baseClasses += ' ring-2 ring-blue-400';
      } else {
        baseClasses += ' hover:ring-1 hover:ring-gray-300 hover:scale-105';
      }
      
      return baseClasses;
    };

    return (
      <div
        key={element.id}
        className={getElementClasses()}
        style={{
          '--grid-column': position.column,
          '--grid-row': position.row,
          '--element-color': getElementCategoryColor(element),
        } as React.CSSProperties}
        data-grid-column={position.column}
        data-grid-row={position.row}
        data-element-color={getElementCategoryColor(element)}
        onClick={() => handleElementClick(element)}
      >
        <div className="text-xs font-medium opacity-80">
          {element.atomicNumber}
        </div>
        <div className="text-sm font-bold">
          {element.symbol}
        </div>
        {isReactivePartner && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
        )}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg" />
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Scroll hint for mobile */}
      <div className="sm:hidden mb-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        <div className="flex items-center justify-center space-x-1">
          <span>← Swipe to explore →</span>
        </div>
      </div>
      
      <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="periodic-table-grid min-w-[320px] xs:min-w-[360px]">
          {elements.map(renderElement)}
          
          {/* Placeholder for lanthanides and actinides indicators */}
          <div className="lanthanide-placeholder">
            <span className="hidden sm:inline">57-71</span>
            <span className="sm:hidden">*</span>
          </div>
          <div className="actinide-placeholder">
            <span className="hidden sm:inline">89-103</span>
            <span className="sm:hidden">**</span>
          </div>
        </div>
      </div>
      
      {/* Legend for mobile */}
      <div className="sm:hidden mt-2 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
        <div>* Lanthanides (57-71) ** Actinides (89-103)</div>
        <div className="text-gray-400 dark:text-gray-500">Tap elements to select • Use Smart Mode for reactions</div>
      </div>
    </div>
  );
}
