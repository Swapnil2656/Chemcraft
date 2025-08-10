import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Element } from '@/types/element';
import { ELEMENTS } from '@/constants/elements';

interface ElementState {
  elements: Element[];
  selectedElement: Element | null;
  searchQuery: string;
  selectedCategory: string | null;
  favorites: number[];
  
  // Actions
  setSelectedElement: (element: Element | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleFavorite: (elementId: number) => void;
  clearAllFavorites: () => void;
  getFilteredElements: () => Element[];
  getElementById: (id: number) => Element | undefined;
  getElementBySymbol: (symbol: string) => Element | undefined;
}

export const useElementStore = create<ElementState>()(
  persist(
    (set, get) => ({
      elements: ELEMENTS,
      selectedElement: null,
      searchQuery: '',
      selectedCategory: null,
      favorites: [],

      setSelectedElement: (element) => set({ selectedElement: element }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      toggleFavorite: (elementId) => set((state) => ({
        favorites: state.favorites.includes(elementId)
          ? state.favorites.filter(id => id !== elementId)
          : [...state.favorites, elementId]
      })),
      
      clearAllFavorites: () => set(() => ({
        favorites: []
      })),
      
      getFilteredElements: () => {
        const { elements, searchQuery, selectedCategory } = get();
        
        return elements.filter(element => {
          const matchesSearch = !searchQuery || 
            element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.atomicNumber.toString().includes(searchQuery);
          
          const matchesCategory = !selectedCategory || 
            element.category === selectedCategory;
          
          return matchesSearch && matchesCategory;
        });
      },
      
      getElementById: (id) => {
        const { elements } = get();
        return elements.find(element => element.id === id);
      },
      
      getElementBySymbol: (symbol) => {
        const { elements } = get();
        return elements.find(element => element.symbol === symbol);
      }
    }),
    {
      name: 'element-store',
      partialize: (state) => ({
        favorites: state.favorites,
        selectedCategory: state.selectedCategory
      })
    }
  )
);
