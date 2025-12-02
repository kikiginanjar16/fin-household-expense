import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class UpdateWalletUseCase {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async execute(id: string, updateWalletDto: UpdateWalletDto, logged?: LoggedUser): Promise<Wallet> {
    try {
      // Validate inputs
      if (!id || !updateWalletDto) {
        throw new BadRequestException('ID and UpdateWalletDto are required');
      }

      // Check if entity exists and is not soft-deleted
      const wallet = await this.walletRepository.findOne({ where: { id } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found or has been deleted`);
      }

      // Update entity with audit fields
      await this.walletRepository.update(id, {
        ...updateWalletDto,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Return updated entity
      return await this.walletRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Wallet: ${error.message}`);
    }
  }
}