import { BadRequestException, Injectable } from '@nestjs/common';
import { ExpenseType, InputAddExpense } from './interface';
import { Expense } from 'src/models/expense.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user.model';
import { expenseEditInput } from './expense.validator';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  allExpenses(userId: string) {
    return this.expenseModel.find({ userId: userId });
  }

  async addExpense(userId: string, input: InputAddExpense) {
    const user = await this.userModel.findOne({ _id: userId });

    const expense = new this.expenseModel();
    expense.type = input.type;
    expense.category = input.category;
    expense.amount = input.amount;
    expense.userId = user;

    await expense.save();
    return { status: 'ok' };
  }

  async deleteExpense(expenseId: string) {
    const expense = await this.expenseModel.findOne({ _id: expenseId });

    if (!expense) {
      return new BadRequestException('invalid id');
    }

    await this.expenseModel.deleteOne({ _id: expenseId });
    return 'expense deleted';
  }

  async editExpense(expenseId: string, input: expenseEditInput) {
    const { category, type, amount } = input;

    await this.expenseModel.updateOne(
      { _id: expenseId },
      {
        $set: {
          category,
          type,
          amount,
        },
      },
    );
    return 'expense updated';
  }
}
