import DocumentDraftingForm from '@/components/document-drafting-form';

export const metadata = {
  title: 'Request Document Drafting - LegalClinic',
  description: 'Request professional drafting of legal documents such as PILs, Sale Deeds, Agreements, and RTI applications.',
};

export default function DocumentDraftingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Request Document Drafting
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Request professional legal document drafting services for PILs, Sale Deeds, 
          Agreements, and RTI applications. Our experts will prepare documents tailored to your needs.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <DocumentDraftingForm />
      </div>
    </div>
  );
}