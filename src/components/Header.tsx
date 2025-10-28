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
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-lg sm:text-xl md:text-2xl font-bold text-slate-100 hover:text-blue-400 transition-all duration-300 ease-in-out">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50">
              <Beaker className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="hidden xs:inline">ChemCraft</span>
            <span className="xs:hidden">CC</span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border transition-all duration-300 ease-in-out text-xs sm:text-sm ${
                    isActive
                      ? 'bg-blue-500/30 border-blue-400/30 text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:shadow-md hover:shadow-black/10'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.shortName}</span>
                </Link>
              );
            })}
            </nav>
            {isSignedIn ? (
              <div className="p-0.5 sm:p-1 bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-sm border border-slate-700/50 text-slate-100 px-3 sm:px-4 md:px-6 py-2 rounded-lg sm:rounded-xl md:rounded-2xl hover:from-blue-600/50 hover:to-purple-600/50 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-blue-500/20 text-xs sm:text-sm">
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
