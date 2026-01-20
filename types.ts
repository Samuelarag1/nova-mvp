
export enum TransactionType {
  SALE = 'SALE',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  supplier?: string;
}

export interface BusinessMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    quantity: number;
    sku: string;
    description?: string;
    supplier?: string;
}

export type ViewState = 'dashboard' | 'sales' | 'expenses' | 'insights' | 'inventory' | 'reports';
