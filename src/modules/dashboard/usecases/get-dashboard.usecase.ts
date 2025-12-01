import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../../../entities/transaction.entity';
import { Wallet } from '../../../entities/wallet.entity';

interface DashboardFilters {
  start_date?: string | Date;
  end_date?: string | Date;
}

@Injectable()
export class GetDashboardUseCase {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async execute(filters: DashboardFilters = {}): Promise<{
    overall: { total_income: number; total_expense: number; balance: number; total_transactions: number };
    per_wallet: Array<{
      wallet_id: string;
      wallet_name: string;
      wallet_currency: string;
      total_income: number;
      total_expense: number;
      balance: number;
      total_transactions: number;
    }>;
  }> {
    try {
      const startDate = filters.start_date ? new Date(filters.start_date) : undefined;
      const endDate = filters.end_date ? new Date(filters.end_date) : undefined;

      if (startDate && Number.isNaN(startDate.getTime())) {
        throw new BadRequestException('Invalid start_date format');
      }

      if (endDate && Number.isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid end_date format');
      }

      const baseQb = this.transactionRepository.createQueryBuilder('t').where('t.deleted_at IS NULL');

      if (startDate) {
        baseQb.andWhere('t.transaction_date >= :start_date', {
          start_date: startDate.toISOString().slice(0, 10),
        });
      }

      if (endDate) {
        baseQb.andWhere('t.transaction_date <= :end_date', {
          end_date: endDate.toISOString().slice(0, 10),
        });
      }

      // Overall aggregation
      const overallRaw = await baseQb
        .clone()
        .select("COALESCE(SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END), 0)", 'total_income')
        .addSelect("COALESCE(SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END), 0)", 'total_expense')
        .addSelect('COUNT(*)', 'total_transactions')
        .setParameters({ income: TransactionType.INCOME, expense: TransactionType.EXPENSE })
        .getRawOne<{
          total_income: string;
          total_expense: string;
          total_transactions: string;
        }>();

      const overall = {
        total_income: Number(overallRaw?.total_income || 0),
        total_expense: Number(overallRaw?.total_expense || 0),
        balance: Number(overallRaw?.total_income || 0) - Number(overallRaw?.total_expense || 0),
        total_transactions: Number(overallRaw?.total_transactions || 0),
      };

      // Per wallet aggregation
      const perWalletRaw = await baseQb
        .clone()
        .select('t.wallet_id', 'wallet_id')
        .addSelect('w.name', 'wallet_name')
        .addSelect('w.currency', 'wallet_currency')
        .addSelect("COALESCE(SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END), 0)", 'total_income')
        .addSelect("COALESCE(SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END), 0)", 'total_expense')
        .addSelect('COUNT(*)', 'total_transactions')
        .innerJoin(Wallet, 'w', 'w.id = t.wallet_id')
        .groupBy('t.wallet_id')
        .addGroupBy('w.name')
        .addGroupBy('w.currency')
        .setParameters({ income: TransactionType.INCOME, expense: TransactionType.EXPENSE })
        .getRawMany<{
          wallet_id: string;
          wallet_name: string;
          wallet_currency: string;
          total_income: string;
          total_expense: string;
          total_transactions: string;
        }>();

      const per_wallet = perWalletRaw.map((row) => ({
        wallet_id: row.wallet_id,
        wallet_name: row.wallet_name,
        wallet_currency: row.wallet_currency,
        total_income: Number(row.total_income || 0),
        total_expense: Number(row.total_expense || 0),
        balance: Number(row.total_income || 0) - Number(row.total_expense || 0),
        total_transactions: Number(row.total_transactions || 0),
      }));

      return {
        overall,
        per_wallet,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve dashboard data: ${error.message}`);
    }
  }
}
