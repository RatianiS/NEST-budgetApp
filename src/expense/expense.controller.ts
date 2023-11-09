import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseType, InputAddExpense } from './interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { expenseEditInput } from './expense.validator';
import { OwnerGuard } from 'src/auth/auth.exp-owner';

interface AppRequest extends Request {
  userId: string;
}

@Controller('/api/v1/expenses')
export class ExpenseController {
  constructor(private readonly ExpenseService: ExpenseService) {}

  @UseGuards(AuthGuard)
  @Get()
  expenses(@Req() req: AppRequest) {
    return this.ExpenseService.allExpenses(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  addExpense(@Req() req: AppRequest, @Body() input: InputAddExpense) {
    return this.ExpenseService.addExpense(req.userId, input);
  }

  @UseGuards(AuthGuard,OwnerGuard)
  @Delete('/:expenseId')
  deleteExpense(@Param('expenseId') expenseId: string) {
    return this.ExpenseService.deleteExpense(expenseId);
  }

  @UseGuards(AuthGuard,OwnerGuard)
  @Put('/:expenseId')
  editExpense(
    @Param('expenseId') expenseId: string,
    @Body() input: expenseEditInput,
  ) {
    return this.ExpenseService.editExpense(expenseId, input);
  }
}
