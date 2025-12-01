import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class GetWalletUseCase {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async execute(id: string, relations: string[] = [], logged?: LoggedUser): Promise<Wallet | null> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      const wallet = await this.walletRepository.findOne({ 
        where: { id, deleted_at: null },
        relations,
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found or has been deleted`);
      }

      return wallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to retrieve Wallet: ${error.message}`);
    }
  }

  async paginate(
    page = 1,
    limit = 10,
    filters: any = {},
    relations: string[] = [],
    logged?: LoggedUser
  ): Promise<{ data: Wallet[], meta: { total: number, page: number, total_page: number } }> {
    try {
      if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      const where = { ...filters, deleted_at: null };
      const [data, total] = await this.walletRepository.findAndCount({
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
      throw new BadRequestException(`Failed to retrieve Wallets: ${error.message}`);
    }
  }
}