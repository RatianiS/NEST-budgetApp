import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';

export type CatDocument = HydratedDocument<Expense>;

@Schema({
  timestamps: true,
})
export class Expense {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 'default' })
  status: 'default' | 'favourite';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
