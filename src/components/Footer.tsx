'use client';

import { Heart, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About ChemCraft
            </h3>
            <p className="text-gray-600 text-sm">
              An interactive chemistry learning platform designed to make chemistry fun and accessible. 
              Explore the periodic table, mix elements, and test your knowledge with engaging quizzes.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/periodic" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Periodic Table
                </a>
              </li>
              <li>
                <a href="/mixer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Element Mixer
                </a>
              </li>
              <li>
                <a href="/quiz" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Quiz
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Get In Touch
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-600" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for chemistry enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
