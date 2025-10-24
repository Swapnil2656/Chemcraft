'use client';

import { Element } from '@/types/element';

import { Heart, ExternalLink, Thermometer, Zap, Info } from 'lucide-react';
import { useElementStore } from '@/stores/elementStore';
import { getElementCategoryColor, formatTemperature, getElementPosition } from '@/lib/elementUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { memo, useCallback, useState, useEffect } from 'react';

interface ElementCardProps {
  element: Element;
}

const ElementCard = memo(({ element }: ElementCardProps) => {
  const { favorites, toggleFavorite, elements } = useElementStore();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const isFavorite = isClient ? favorites.includes(element.id) : false;

  const handleFavoriteToggle = useCallback(() => {
    if (isClient) {
      toggleFavorite(element.id);
    }
  }, [element.id, toggleFavorite, isClient]);

  return (
    <div className="h-full">
      <Card className="h-full overflow-hidden bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-200/20 shadow-xl hover:shadow-2xl shadow-black/10 transition-all duration-300 ease-in-out">
        <CardHeader 
          className="text-white relative element-card-header backdrop-blur-sm"
          style={{ backgroundColor: `${getElementCategoryColor(element)}CC` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl font-bold">{element.symbol}</div>
              <div>
                <CardTitle className="text-2xl font-semibold text-white">{element.name}</CardTitle>
                <p className="text-white/80">Atomic Number: {element.atomicNumber}</p>
              </div>
            </div>
            <div
              className="relative z-20 cursor-pointer favorite-button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleFavoriteToggle();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  e.preventDefault();
                  handleFavoriteToggle();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <div className="p-2 rounded-full hover:bg-white/20">
                <Heart 
                  className={`h-6 w-6 ${
                    isFavorite 
                      ? 'text-red-400 drop-shadow-lg' 
                      : 'text-white'
                  }`} 
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </div>
            </div>
          </div>
          
          {isClient && (
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 overflow-hidden">
              <div className="grid grid-cols-18 gap-px text-xs">
                {Array.from({ length: 118 }, (_, i) => {
                  const atomicNumber = i + 1;
                  const miniElement = elements.find(e => e.atomicNumber === atomicNumber);
                  if (!miniElement) return null;
                  
                  const position = getElementPosition(miniElement);
                  const isCurrentElement = miniElement.id === element.id;
                  
                  return (
                    <div
                      key={atomicNumber}
                      className={`mini-element-cell w-1 h-1 rounded-sm ${
                        isCurrentElement ? 'ring-1 ring-white' : ''
                      }`}
                      style={{
                        gridColumn: position.column,
                        gridRow: position.row,
                        backgroundColor: getElementCategoryColor(miniElement)
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <TooltipProvider>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1 font-medium">
                          Atomic Weight
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          {element.atomicWeight}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average mass of atoms of this element</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                        <div className="text-xs text-purple-600 mb-1 font-medium">
                          Category
                        </div>
                        <div className="text-lg font-bold text-purple-900">
                          {element.category.replace('-', ' ')}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chemical classification of this element</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-600 mb-1 font-medium">
                      Period
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      {element.period}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                    <div className="text-xs text-orange-600 mb-1 font-medium">
                      Group
                    </div>
                    <div className="text-lg font-bold text-orange-900">
                      {element.group}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-indigo-900">
                      Electron Configuration
                    </h3>
                  </div>
                  <div className="font-mono text-sm bg-white/50 rounded p-2 text-indigo-800">
                    {element.electronConfiguration}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="properties" className="space-y-4 mt-4">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Thermometer className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-emerald-900">
                      Physical Properties
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                      <span className="text-emerald-700 font-medium">Phase:</span>
                      <Badge variant="outline" className="capitalize">
                        {element.phase}
                      </Badge>
                    </div>
                    {element.meltingPoint && (
                      <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                        <span className="text-emerald-700 font-medium">Melting Point:</span>
                        <span className="font-semibold">
                          {formatTemperature(element.meltingPoint)}
                        </span>
                      </div>
                    )}
                    {element.boilingPoint && (
                      <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                        <span className="text-emerald-700 font-medium">Boiling Point:</span>
                        <span className="font-semibold">
                          {formatTemperature(element.boilingPoint)}
                        </span>
                      </div>
                    )}
                    {element.density && (
                      <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                        <span className="text-emerald-700 font-medium">Density:</span>
                        <span className="font-semibold">
                          {element.density} g/cm³
                        </span>
                      </div>
                    )}
                    {element.electronegativity && (
                      <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                        <span className="text-emerald-700 font-medium">Electronegativity:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={element.electronegativity * 25} className="w-16 h-2" />
                          <span className="font-semibold">{element.electronegativity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {element.properties && element.properties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-slate-100 transition-colors duration-300">
                      Chemical Properties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {element.properties.map((property, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border-violet-200"
                        >
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="h-5 w-5 text-rose-600" />
                    <h3 className="text-lg font-semibold text-rose-900">
                      Description
                    </h3>
                  </div>
                  <p className="text-rose-800 leading-relaxed">
                    {element.description}
                  </p>
                </div>
                
                {element.discoveredBy && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                    <h3 className="text-lg font-semibold mb-3 text-amber-900">
                      Discovery
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          Discovered by
                        </Badge>
                        <span className="font-semibold text-amber-900">{element.discoveredBy}</span>
                      </div>
                      {element.discoveredYear && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            Year
                          </Badge>
                          <span className="font-semibold text-amber-900">
                            {element.discoveredYear > 0 ? element.discoveredYear : `${Math.abs(element.discoveredYear)} BCE`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {element.uses && element.uses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-slate-100 transition-colors duration-300">
                      Common Uses
                    </h3>
                    <div className="space-y-2">
                      {element.uses.map((use, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors duration-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-slate-300 transition-colors duration-300">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <Button 
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                  onClick={() => window.open(`https://en.wikipedia.org/wiki/${element.name}`, '_blank')}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Learn More on Wikipedia</span>
                </Button>
              </TabsContent>
            </Tabs>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
});

ElementCard.displayName = 'ElementCard';

export default ElementCard;