import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class expenseEditInput {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsString()
  type: string;
  category: string;
}
