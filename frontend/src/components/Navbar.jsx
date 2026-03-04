import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-navy-800 bg-opacity-90 backdrop-blur-sm py-4 shadow-lg">
      <div className="w-full px-4">
        <div className="flex justify-between items-center">

          {/* Left: Logo and Title — fully left aligned */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* Logo Image with Rotation */}
              <img
                src="/traffic-light.svg"
                alt="Traffiscan Logo"
                className="h-8 w-auto animate-spin"
              />
              <span className="text-accent-yellow text-3xl font-extrabold tracking-wide drop-shadow-lg">
                Traffiscan
              </span>
            </Link>
          </div>

          {/* Right: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link to="/" className="text-white hover:text-accent-yellow">Home</Link>
            <Link to="/about" className="text-white hover:text-accent-yellow">About</Link>
            <Link to="/contact" className="text-white hover:text-accent-yellow">Contact us</Link>
            <Link to="/settings" className="text-white hover:text-accent-yellow">Settings</Link>
            <Link to="/account" className="text-white hover:text-accent-yellow">
              <User size={24} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-navy-700 rounded-lg p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-accent-yellow" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="text-white hover:text-accent-yellow" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-white hover:text-accent-yellow" onClick={() => setIsMenuOpen(false)}>Contact us</Link>
              <Link to="/settings" className="text-white hover:text-accent-yellow" onClick={() => setIsMenuOpen(false)}>Settings</Link>
              <Link to="/account" className="text-white hover:text-accent-yellow flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <User size={20} />
                <span>Account</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
