'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Beaker, Table, Zap, BookOpen, Heart } from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';


export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Beaker },
    { name: 'Periodic Table', href: '/periodic', icon: Table },
    { name: 'Element Mixer', href: '/mixer', icon: Zap },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Quiz', href: '/quiz', icon: BookOpen },
  ];
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
            <Beaker className="h-8 w-8" />
            <span>ChemCraft</span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            </nav>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex flex-wrap gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
