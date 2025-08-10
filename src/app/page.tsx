'use client';

import Link from 'next/link';
import { Table, Zap, BookOpen, Star, Users, Award } from 'lucide-react';

export default function HomePage() {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl"></div>
        <div className="relative z-10 py-20 px-8 text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChemCraft
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your interactive chemistry learning companion. Explore the periodic table, 
              mix elements, and master chemistry through engaging quizzes and experiments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/periodic"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Explore Periodic Table
              </Link>
              <Link
                href="/quiz"
                className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to master chemistry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title}>
                <Link href={feature.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl cursor-pointer group">
                    <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
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
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            By the Numbers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of students learning chemistry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of students who are mastering chemistry with ChemCraft
          </p>
          <Link
            href="/periodic"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}