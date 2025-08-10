'use client';

import { useState } from 'react';
import { useElementStore } from '@/stores/elementStore';
import ElementCard from '@/components/ElementCard';

export default function TestPage() {
  const { elements } = useElementStore();
  const [selectedElement, setSelectedElement] = useState(elements[0]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Test Page
          </h1>
          <p className="text-xl text-gray-600">
            Testing individual components and functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Element Selection</h2>
            <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {elements.slice(0, 20).map((element) => (
                <button
                  key={element.id}
                  onClick={() => setSelectedElement(element)}
                  className={`p-2 rounded border text-sm font-medium transition-colors ${
                    selectedElement.id === element.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {element.symbol}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Element Card</h2>
            <ElementCard element={selectedElement} />
          </div>
        </div>
      </div>
    </div>
  );
}