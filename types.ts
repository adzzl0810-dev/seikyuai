
export enum TaxRate {
  STANDARD = 0.10, // 10%
  REDUCED = 0.08,  // 8% (Food, etc.)
  EXEMPT = 0.00    // 0%
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  taxRate: TaxRate;
}

export interface Issuer {
  name: string;
  registrationNumber: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  bankInfo: string;
  enableStamp: boolean;
  stampImageUrl?: string;
  logoImageUrl?: string;
}

export interface Client {
  name: string;
  address?: string;
  zipCode?: string;
}

export interface InvoiceData {
  title: string; // "御請求書", "御見積書", etc.
  invoiceNumber: string;
  date: string;
  dueDate: string;
  issuer: Issuer;
  client: Client;
  items: LineItem[];
  notes: string;
}

export interface TaxSummary {
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  taxSummaries: TaxSummary[];
}

export type TemplateId =
  | 'modern' | 'classic' | 'simple'
  | 'bold' | 'elegant' | 'tech' | 'nature' | 'grid'
  | 'corporate' | 'monochrome' | 'warm' | 'cool' | 'compact'
  | 'playful' | 'shadow' | 'borderless' | 'sharp' | 'soft'
  | 'vintage' | 'studio';

export interface SavedInvoice extends InvoiceData {
  id: string;
  createdAt: number;
  templateId: TemplateId;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}
