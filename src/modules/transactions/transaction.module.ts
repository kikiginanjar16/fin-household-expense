import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controllers/transaction.controller';
import { CreateTransactionUseCase } from './usecases/create-transaction.usecase';
import { GetTransactionUseCase } from './usecases/get-transaction.usecase';
import { UpdateTransactionUseCase } from './usecases/update-transaction.usecase';
import { DeleteTransactionUseCase } from './usecases/delete-transaction.usecase';
import { Transaction } from '../../entities/transaction.entity';
import { Planning } from '../../entities/planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Planning])],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
})
export class TransactionModule {}
