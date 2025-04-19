import Link from 'next/link';
import { FileText, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Expert Legal Assistance <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get professional legal guidance, answers to your questions, and document drafting services in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-medium">
                <Link href="/legal-questions">Ask a Legal Question</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <Link href="/legal-chat">Chat with Legal Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal Questions</h3>
              <p className="text-muted-foreground mb-4">
                Get answers to your legal queries related to Motor Vehicle Act, Sale Deeds, Property Transfer, and Bail.
              </p>
              <Button asChild variant="ghost" className="font-medium">
                <Link href="/legal-questions">Ask a Question</Link>
              </Button>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Drafting</h3>
              <p className="text-muted-foreground mb-4">
                Request draft documents including PILs, Sale Deeds, Agreements, and RTI applications.
              </p>
              <Button asChild variant="ghost" className="font-medium">
                <Link href="/document-drafting">Draft a Document</Link>
              </Button>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal Chatbot</h3>
              <p className="text-muted-foreground mb-4">
                Chat in real-time with our AI-powered legal assistant for immediate guidance on legal matters.
              </p>
              <Button asChild variant="ghost" className="font-medium">
                <Link href="/legal-chat">Start Chatting</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Legal Services?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66666 10.1147L12.7947 3.98599L13.7381 4.92866L6.66666 12L2.42399 7.75733L3.36666 6.81466L6.66666 10.1147Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Expert Legal Guidance</h3>
                    <p className="text-muted-foreground">Access to professional legal advice for various legal areas.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66666 10.1147L12.7947 3.98599L13.7381 4.92866L6.66666 12L2.42399 7.75733L3.36666 6.81466L6.66666 10.1147Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Time and Cost Efficient</h3>
                    <p className="text-muted-foreground">Save time and money by getting legal help online without multiple consultations.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66666 10.1147L12.7947 3.98599L13.7381 4.92866L6.66666 12L2.42399 7.75733L3.36666 6.81466L6.66666 10.1147Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Professional Document Drafting</h3>
                    <p className="text-muted-foreground">Get legally sound documents drafted according to your specific needs.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66666 10.1147L12.7947 3.98599L13.7381 4.92866L6.66666 12L2.42399 7.75733L3.36666 6.81466L6.66666 10.1147Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">24/7 Assistance</h3>
                    <p className="text-muted-foreground">Our AI chatbot is available round-the-clock to answer your basic legal questions.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 lg:mt-0 bg-card p-8 rounded-lg border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Legal Areas We Cover</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Motor Vehicle Act</h4>
                  <p className="text-sm text-muted-foreground">Questions about accidents, insurance claims, traffic violations</p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Sale Deeds</h4>
                  <p className="text-sm text-muted-foreground">Property sale agreements, title transfers, legal requirements</p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Property Transfer</h4>
                  <p className="text-sm text-muted-foreground">Property rights, legal documentation, dispute resolution</p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Bail Matters</h4>
                  <p className="text-sm text-muted-foreground">Bail applications, conditions, legal procedures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Legal Assistance?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Start by asking a question, requesting a document draft, or chatting with our legal assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-medium">
              <Link href="/legal-questions">Ask a Question</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-medium border-primary-foreground/30 hover:bg-primary-foreground/10">
              <Link href="/document-drafting">Request a Document</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}