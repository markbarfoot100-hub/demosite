import { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/30">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png"
                alt="Cosmic Cannabis"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="font-cosmic text-xl text-white cosmic-text-glow">
                Cosmic Cannabis
              </h1>
              <p className="text-xs text-purple-300 font-light">Medical Dispensary</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-pink-300 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-white hover:text-pink-300 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/admin" 
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white hover:from-purple-700 hover:to-pink-700 transition-all cosmic-glow font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-pink-300 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-purple-500/30">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-pink-300 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-white hover:text-pink-300 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white hover:from-purple-700 hover:to-pink-700 transition-all cosmic-glow font-medium w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
