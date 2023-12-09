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

  async favouriteExpense(expenseId: string) {
    const expense = await this.expenseModel.findOne({ _id: expenseId });
    // console.log(expense);

    if (!expense) {
      throw new BadRequestException('User not found');
    }

    expense.status = 'favourite';

    await expense.save();
    console.log(expense);

    return 'expense favourited';
  }

  async filterData(
    userId: string,
    min: number,
    max: number,
    category: string,
    type: string,
    dateStart: string,
    dateEnd: string,
  ) {
    const expenses: ExpenseType[] = await this.expenseModel.find({ userId });

    const search = expenses.filter((exp) => {
      const dateMatched =
        (!dateStart || Date.parse(exp.createdAt) > Date.parse(dateStart)) &&
        (!dateEnd || Date.parse(exp.createdAt) < Date.parse(dateEnd));
      const categorymatched =
        !category || exp.category.toLowerCase() === category.toLowerCase();
      const typeMatched =
        !type || exp.type.toLowerCase() === type.toLowerCase();
      const minAndMaxMAtched =
        (!min || +exp.amount > +min) && (!max || +exp.amount < +max);
      return categorymatched && typeMatched && minAndMaxMAtched && dateMatched;
    });
    return search;
  }
}
