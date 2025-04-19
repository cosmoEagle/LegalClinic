// Legal question related types
export interface LegalQuestion {
  id?: string;
  topic: LegalTopic;
  question: string;
  additionalDetails?: string;
  submitted?: boolean;
  answer?: string;
  createdAt?: Date;
}

export type LegalTopic = 'mva' | 'sale-deeds' | 'tpa' | 'bail';

export const legalTopicLabels: Record<LegalTopic, string> = {
  'mva': 'Motor Vehicle Act',
  'sale-deeds': 'Sale Deeds',
  'tpa': 'Transfer of Property Act',
  'bail': 'Bail Matters'
};

// Document drafting related types
export interface DocumentRequest {
  id?: string;
  documentType: DocumentType;
  purpose: string;
  details: string;
  additionalRequirements?: string;
  submitted?: boolean;
  document?: string;
  createdAt?: Date;
}

export type DocumentType = 'pil' | 'sale-deed' | 'agreement' | 'rti';

export const documentTypeLabels: Record<DocumentType, string> = {
  'pil': 'Public Interest Litigation (PIL)',
  'sale-deed': 'Sale Deed',
  'agreement': 'Legal Agreement',
  'rti': 'RTI Application'
};

// Chat related types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}