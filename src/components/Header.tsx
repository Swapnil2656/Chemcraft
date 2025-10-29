'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Beaker, Table, Zap, BookOpen, Heart } from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';


export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Beaker, shortName: 'Home' },
    { name: 'Periodic Table', href: '/periodic', icon: Table, shortName: 'Table' },
    { name: 'Element Mixer', href: '/mixer', icon: Zap, shortName: 'Mixer' },
    { name: 'Favorites', href: '/favorites', icon: Heart, shortName: 'Favs' },
    { name: 'Quiz', href: '/quiz', icon: BookOpen, shortName: 'Quiz' },
  ];
  
  return (
    <header className="bg-slate-900/30 backdrop-blur-md backdrop-saturate-150 border-b border-slate-700/50 sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Prominent and always visible on mobile */}
          <Link href="/" className="flex items-center space-x-2 text-lg sm:text-xl md:text-2xl font-bold text-slate-100 hover:text-blue-400 transition-all duration-300 ease-in-out flex-shrink-0 relative">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-sm rounded-xl border border-blue-400/30 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300">
              <Beaker className="h-6 w-6 sm:h-7 sm:w-7 text-blue-300 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="hidden min-[480px]:inline leading-tight">ChemCraft</span>
              <span className="min-[480px]:hidden font-bold text-blue-300 leading-tight">CC</span>
            </div>
          </Link>
          
          {/* Navigation - More compact on mobile */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <nav className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-center space-x-1 sm:space-x-2 px-1.5 sm:px-2 md:px-3 py-2 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border transition-all duration-300 ease-in-out text-xs sm:text-sm min-w-[40px] sm:min-w-auto ${
                    isActive
                      ? 'bg-blue-500/30 border-blue-400/30 text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:shadow-md hover:shadow-black/10'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">{item.name}</span>
                  <span className="sm:hidden sr-only">{item.shortName}</span>
                </Link>
              );
            })}
            </nav>
            {isSignedIn ? (
              <div className="p-0.5 sm:p-1 bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 ml-1 sm:ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-sm border border-slate-700/50 text-slate-100 px-2 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl md:rounded-2xl hover:from-blue-600/50 hover:to-purple-600/50 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-blue-500/20 text-xs sm:text-sm whitespace-nowrap ml-1 sm:ml-2">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
