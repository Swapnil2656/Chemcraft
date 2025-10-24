'use client';

import { Heart, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900/30 backdrop-blur-md backdrop-saturate-150 border-t border-slate-700/50 mt-auto transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 transition-all duration-300 ease-in-out">
              About ChemCraft
            </h3>
            <p className="text-slate-300 text-sm transition-all duration-300 ease-in-out">
              An interactive chemistry learning platform designed to make chemistry fun and accessible. 
              Explore the periodic table, mix elements, and test your knowledge with engaging quizzes.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 transition-all duration-300 ease-in-out">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-slate-300 hover:text-blue-400 transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/periodic" className="text-slate-300 hover:text-blue-400 transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm">
                  Periodic Table
                </a>
              </li>
              <li>
                <a href="/mixer" className="text-slate-300 hover:text-blue-400 transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm">
                  Element Mixer
                </a>
              </li>
              <li>
                <a href="/quiz" className="text-slate-300 hover:text-blue-400 transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-slate-700/30 backdrop-blur-sm">
                  Quiz
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 transition-all duration-300 ease-in-out">
              Get In Touch
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-slate-300" />
              </a>
              <a
                href="#"
                className="p-3 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-slate-300" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-700/50 transition-all duration-300 ease-in-out">
          <div className="flex justify-center items-center">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl px-6 py-3 border border-slate-700/50 shadow-md">
              <p className="text-slate-300 text-sm flex items-center transition-all duration-300 ease-in-out">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" /> for chemistry enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
