'use client';

import Link from 'next/link';
import { Table, Zap, BookOpen, Star, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const features = [
    {
      icon: Table,
      title: 'Interactive Periodic Table',
      description: 'Explore all elements with detailed information, properties, and visual representations.',
      href: '/periodic',
      color: 'bg-blue-500'
    },
    {
      icon: Zap,
      title: 'Element Mixer',
      description: 'Mix elements to create compounds and learn about chemical reactions.',
      href: '/mixer',
      color: 'bg-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Chemistry Quiz',
      description: 'Test your knowledge with interactive quizzes covering all chemistry topics.',
      href: '/quiz',
      color: 'bg-green-500'
    }
  ];

  const stats = [
    { icon: Star, value: '118', label: 'Elements' },
    { icon: Zap, value: '100+', label: 'Compounds' },
    { icon: Award, value: '500+', label: 'Quiz Questions' }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden mx-2 sm:mx-4 md:mx-8 mt-4 sm:mt-8 mb-8 sm:mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-700/50"></div>
        <div className="relative z-10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 text-center">
          <div className="backdrop-blur-md bg-slate-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-700/50 shadow-2xl shadow-black/10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-100 mb-4 sm:mb-6 transition-all duration-300 ease-in-out leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ChemCraft
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto transition-all duration-300 ease-in-out">
              Your interactive chemistry learning companion. Explore the periodic table, 
              mix elements, and master chemistry through engaging quizzes and experiments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/periodic"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-sm border border-slate-700/50 text-slate-100 rounded-xl sm:rounded-2xl font-semibold hover:from-blue-600/60 hover:to-purple-600/60 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-blue-500/20 text-sm sm:text-base"
              >
                Explore Periodic Table
              </Link>
              <Link
                href="/quiz"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/30 backdrop-blur-sm border-2 border-blue-400/30 text-blue-400 hover:bg-blue-500/30 hover:text-slate-100 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-blue-500/10 text-sm sm:text-base"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 md:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-3 sm:mb-4 transition-all duration-300 ease-in-out">
            Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 transition-all duration-300 ease-in-out">
            Everything you need to master chemistry
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title}>
                <Link href={feature.href}>
                  <div className="bg-slate-800/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-700/50 shadow-xl hover:shadow-2xl shadow-black/10 cursor-pointer group transition-all duration-300 ease-in-out hover:bg-slate-800/50 hover:-translate-y-1 sm:hover:-translate-y-2 h-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${feature.color}/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-slate-700/50 group-hover:scale-110 transition-all duration-300 ease-in-out`}>
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-100 mb-2 sm:mb-3 md:mb-4 transition-all duration-300 ease-in-out">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 transition-all duration-300 ease-in-out leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 mx-2 sm:mx-4 md:mx-8 mb-8 sm:mb-12 md:mb-16">
        <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-700/50 shadow-2xl shadow-black/10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-3 sm:mb-4 transition-all duration-300 ease-in-out">
              By the Numbers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 transition-all duration-300 ease-in-out">
              Join thousands of students learning chemistry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-xl sm:rounded-2xl mb-4 sm:mb-5 md:mb-6 border border-slate-700/50 group-hover:scale-110 transition-all duration-300 ease-in-out shadow-lg">
                    <Icon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-2 transition-all duration-300 ease-in-out">
                    {stat.value}
                  </div>
                  <div className="text-slate-300 transition-all duration-300 ease-in-out text-sm sm:text-base md:text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 text-center mx-2 sm:mx-4 md:mx-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-700/50 shadow-2xl shadow-black/10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-3 sm:mb-4 transition-all duration-300 ease-in-out">
            Ready to Start Learning?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 transition-all duration-300 ease-in-out max-w-2xl mx-auto">
            Join thousands of students who are mastering chemistry with ChemCraft
          </p>
          <Link
            href="/periodic"
            className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40 backdrop-blur-sm border border-slate-700/50 text-slate-100 rounded-xl sm:rounded-2xl font-semibold hover:from-blue-600/60 hover:via-purple-600/60 hover:to-pink-600/60 transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl shadow-blue-500/20 hover:-translate-y-1 text-sm sm:text-base"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}