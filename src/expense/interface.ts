export interface ExpenseType {
  id: number;
  type: string;
  category: string;
  amount: number;
  favourite: 'default' | 'favourite';
  createdAt: Date;
}

export interface InputAddExpense {
  type: string;
  category: string;
  amount: number;
}
