'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Scale, FileText, MessageSquare, LogIn, UserPlus, LogOut } from 'lucide-react';
import ThemeToggle from './theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home page
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Legal Questions', href: '/legal-questions' },
    { name: 'Document Drafting', href: '/document-drafting' },
    { name: 'Legal Chat', href: '/legal-chat' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Scale className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">LegalClinic</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth buttons */}
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Auth buttons for mobile */}
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1 mt-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/login" onClick={closeMenu}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-1"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}