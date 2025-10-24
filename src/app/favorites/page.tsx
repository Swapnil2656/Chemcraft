'use client';

import { useElementStore } from '@/stores/elementStore';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import { Heart, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getElementCategoryColor } from '@/lib/elementUtils';
import Link from 'next/link';
import { useState } from 'react';

export default function FavoritesPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { elements, favorites, toggleFavorite, clearAllFavorites } = useElementStore();
  const [animatingHearts, setAnimatingHearts] = useState<Set<number>>(new Set());
  
  const favoriteElements = elements.filter(element => favorites.includes(element.id));

  const handleHeartClick = (elementId: number) => {
    setAnimatingHearts(prev => new Set(prev).add(elementId));
    toggleFavorite(elementId);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setAnimatingHearts(prev => {
        const newSet = new Set(prev);
        newSet.delete(elementId);
        return newSet;
      });
    }, 500);
  };

  const handleClearAll = () => {
    clearAllFavorites();
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-900 dark:text-slate-100 transition-colors duration-300">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100 transition-colors duration-300">Sign in to view your favorites</h2>
        <p className="text-gray-600 dark:text-slate-300 mb-6 transition-colors duration-300">You need to be signed in to save and view your favorite elements.</p>
        <SignInButton mode="modal">
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 dark:from-slate-900/40 dark:via-slate-800/20 dark:to-purple-900/30">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-200/20 shadow-lg shadow-black/5 mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-center gap-3 transition-all duration-300 ease-in-out">
            <div className="p-3 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-200/30">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            Favorite Elements
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out">
            Your saved elements collection
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {favoriteElements.length} Favorite{favoriteElements.length !== 1 ? 's' : ''}
          </Badge>
          {favoriteElements.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        <Link href="/periodic">
          <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
            Add More Elements
          </Button>
        </Link>
      </div>

      {/* Favorites Grid */}
      {favoriteElements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteElements.map((element, index) => (
            <div key={element.id} className="relative">
              <Card className="h-full overflow-hidden bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-200/20 shadow-xl hover:shadow-2xl shadow-black/10 transition-all duration-300 ease-in-out hover:-translate-y-1">
                {/* Header */}
                <CardHeader 
                  className="text-white relative backdrop-blur-sm"
                  style={{ backgroundColor: `${getElementCategoryColor(element)}CC` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold">{element.symbol}</div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-white">{element.name}</CardTitle>
                        <p className="text-white/80">#{element.atomicNumber}</p>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleHeartClick(element.id)}
                        className="text-white hover:bg-white/20 relative"
                      >
                        <Heart className="h-5 w-5 fill-current drop-shadow-lg" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-4 bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm transition-all duration-300 ease-in-out">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300">Category</span>
                      <Badge variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 transition-colors duration-300">
                        {element.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300">Atomic Weight</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">{element.atomicWeight}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300">Period</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">{element.period}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300">Group</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 transition-colors duration-300">{element.group || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600 transition-colors duration-300">
                    <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 transition-colors duration-300">
                      {element.description}
                    </p>
                  </div>

                  {/* Learn More */}
                  <div className="mt-4">
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                      onClick={() => window.open(`https://en.wikipedia.org/wiki/${element.name}`, '_blank')}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gray-100 dark:bg-slate-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
            <Heart className="h-12 w-12 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-300">No Favorite Elements Yet</h3>
          <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-md mx-auto transition-colors duration-300">
            Start exploring the periodic table and click the heart icon on any element to add it to your favorites.
          </p>
          <Link href="/periodic">
            <Button size="lg" className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
              <Star className="h-5 w-5" />
              Explore Periodic Table
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
