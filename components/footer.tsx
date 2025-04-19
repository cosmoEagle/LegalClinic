import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <Scale className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold">LegalClinic</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional legal assistance at your fingertips
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal-questions" className="hover:text-primary transition-colors">
                  Legal Questions
                </Link>
              </li>
              <li>
                <Link href="/document-drafting" className="hover:text-primary transition-colors">
                  Document Drafting
                </Link>
              </li>
              <li>
                <Link href="/legal-chat" className="hover:text-primary transition-colors">
                  Legal Chat
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-3">Legal Areas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal-questions?topic=mva" className="hover:text-primary transition-colors">
                  Motor Vehicle Act
                </Link>
              </li>
              <li>
                <Link href="/legal-questions?topic=sale-deeds" className="hover:text-primary transition-colors">
                  Sale Deeds
                </Link>
              </li>
              <li>
                <Link href="/legal-questions?topic=tpa" className="hover:text-primary transition-colors">
                  Transfer of Property Act
                </Link>
              </li>
              <li>
                <Link href="/legal-questions?topic=bail" className="hover:text-primary transition-colors">
                  Bail
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} LegalClinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}