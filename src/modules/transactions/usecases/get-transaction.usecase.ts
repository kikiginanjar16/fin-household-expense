import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async execute(id: string, relations: string[] = [], logged?: LoggedUser): Promise<Transaction | null> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      const transaction = await this.transactionRepository.findOne({ 
        where: { id, deleted_at: null },
        relations,
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found or has been deleted`);
      }

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to retrieve Transaction: ${error.message}`);
    }
  }

  async paginate(
    page = 1,
    limit = 10,
    filters: any = {},
    relations: string[] = [],
    logged?: LoggedUser
  ): Promise<{ data: Transaction[], meta: { total: number, page: number, total_page: number } }> {
    try {
      if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      const where = { ...filters, deleted_at: null };
      const [data, total] = await this.transactionRepository.findAndCount({
        where,
        relations,
        order: { 'created_at': 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total_page = Math.ceil(total / limit);

      return {
        data,
        meta:{
          total,
          page,
          total_page
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve Transactions: ${error.message}`);
    }
  }
}