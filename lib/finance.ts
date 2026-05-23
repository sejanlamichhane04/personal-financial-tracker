export type TransactionType = "income" | "expense";

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  recurring: boolean;
  frequency: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface TransactionPayload {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface BillPayload {
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  recurring: boolean;
  frequency: string;
  isPaid?: boolean;
}

export interface GoalPayload {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
  category: string;
}
