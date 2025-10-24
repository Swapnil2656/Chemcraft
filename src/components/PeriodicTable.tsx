'use client';

import { useEffect } from 'react';
import { useElementStore } from '@/stores/elementStore';
import { getElementPosition, getElementCategoryColor } from '@/lib/elementUtils';
import { Element } from '@/types/element';

interface PeriodicTableProps {
  onElementClick?: (element: Element) => void;
}

export default function PeriodicTable({ onElementClick }: PeriodicTableProps = {}) {
  const { elements, selectedElement, setSelectedElement } = useElementStore();





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

    return (
      <div
        key={element.id}
        className={`element-cell group cursor-pointer ${
          isSelected 
            ? 'ring-2 ring-blue-400' 
            : 'hover:ring-1 hover:ring-gray-300'
        }`}
        style={{
          '--grid-column': position.column,
          '--grid-row': position.row,
          '--element-color': getElementCategoryColor(element),
          gridColumn: position.column,
          gridRow: position.row,
          backgroundColor: getElementCategoryColor(element)
        } as React.CSSProperties}
        onClick={() => handleElementClick(element)}
      >
        <div className="text-xs font-medium opacity-80">
          {element.atomicNumber}
        </div>
        <div className="text-sm font-bold">
          {element.symbol}
        </div>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg" />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="periodic-table-grid">
        {elements.map(renderElement)}
        
        {/* Placeholder for lanthanides and actinides indicators */}
        <div className="lanthanide-placeholder">
          57-71
        </div>
        <div className="actinide-placeholder">
          89-103
        </div>
      </div>
    </div>
  );
}
