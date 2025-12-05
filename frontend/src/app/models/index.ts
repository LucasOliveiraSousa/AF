export interface Category {
  _id?: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Transaction {
  _id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category | string;
  date: Date | string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Balance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySummary {
  name: string;
  amount: number;
  color: string;
}
