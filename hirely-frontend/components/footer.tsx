// components/Footer.tsx
import React from 'react';
import { Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Hirely Logo" className="w-20 sm:w-24 md:w-28 h-auto" />
            </div>
            <span className="text-gray-400 text-xs hidden sm:inline">|</span>
            <span className="text-gray-600 text-xs md:text-sm">
              © Hirely {new Date().getFullYear()}. All rights reserved.
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="w-4 h-4 text-gray-600" />
            </a>
            <a
              href="https://x.com/"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Twitter"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="w-4 h-4 text-gray-600" />
            </a>
            <a
              href="https://www.youtube.com/"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="YouTube"
              target="_blank"
              rel="noreferrer"
            >
              <Youtube className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;