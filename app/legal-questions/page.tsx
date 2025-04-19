import LegalQuestionForm from '@/components/legal-question-form';

export const metadata = {
  title: 'Ask a Legal Question - LegalClinic',
  description: 'Submit your legal questions related to Motor Vehicle Act, Sale Deeds, Property Transfer, and Bail matters.',
};

export default function LegalQuestionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Ask a Legal Question
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Submit your legal questions related to Motor Vehicle Act, Sale Deeds, 
          Transfer of Property Act, or Bail matters. Our experts will provide you with professional guidance.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <LegalQuestionForm />
      </div>
    </div>
  );
}