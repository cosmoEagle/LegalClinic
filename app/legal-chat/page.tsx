import LegalChatInterface from '@/components/legal-chat-interface';

export const metadata = {
  title: 'Legal Chat Assistant - LegalClinic',
  description: 'Chat with our AI-powered legal assistant for immediate help with legal questions and guidance.',
};

export default function LegalChatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Chat with Our Legal Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get immediate assistance with your legal questions through our AI-powered 
          chat interface. Available 24/7 to provide guidance on common legal matters.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <LegalChatInterface />
      </div>
    </div>
  );
}