import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class DeleteWalletUseCase {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async execute(id: string, logged?: LoggedUser): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      // Check if entity exists and is not already soft-deleted
      const wallet = await this.walletRepository.findOne({ where: { id, deleted_at: null } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found or has been deleted`);
      }

      // Perform soft delete with audit fields
      const result = await this.walletRepository.softDelete({
        id,
        deleted_at: null,
      });

      if (result.affected > 0) {
        await this.walletRepository.update(id, {
          deleted_by: logged?.name || 'system',
          deleted_id: logged?.id || null,
        });
      }

      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete Wallet: ${error.message}`);
    }
  }
}