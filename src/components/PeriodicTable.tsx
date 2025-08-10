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
          gridColumn: position.column,
          gridRow: position.row,
          backgroundColor: getElementCategoryColor(element)
        }}
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
        <div 
          className="flex items-center justify-center text-gray-500 text-xs font-medium bg-gray-100 rounded border border-dashed border-gray-300"
          style={{ gridColumn: 3, gridRow: 6, minHeight: '40px', color: '#6b7280' }}
        >
          57-71
        </div>
        <div 
          className="flex items-center justify-center text-gray-500 text-xs font-medium bg-gray-100 rounded border border-dashed border-gray-300"
          style={{ gridColumn: 3, gridRow: 7, minHeight: '40px', color: '#6b7280' }}
        >
          89-103
        </div>
      </div>
    </div>
  );
}
