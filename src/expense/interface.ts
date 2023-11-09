export interface ExpenseType {
  id: number;
  type: string;
  category: string;
  amount: number;
  createdAt: Date;
}

export interface InputAddExpense {
  type: string;
  category: string;
  amount: number;
}
