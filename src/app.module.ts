import { Module } from '@nestjs/common';
import { ExpenseModule } from './expense/expense.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ExpenseModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://sratiani5:sabasaba12345@budgetapp.4fff94y.mongodb.net/?retryWrites=true&w=majority',
    ),
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// mongodb+srv://sratiani5:<password>@budgetapp.4fff94y.mongodb.net/?retryWrites=true&w=majority
