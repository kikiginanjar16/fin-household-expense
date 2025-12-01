import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../../entities/wallet.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class CreateWalletUseCase {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async execute(createWalletDto: CreateWalletDto, logged?: LoggedUser): Promise<Wallet> {
    try {
      // Validate DTO
      if (!createWalletDto) {
        throw new BadRequestException('CreateWalletDto is required');
      }

      const now = new Date();
      const month = createWalletDto.month ?? now.getMonth() + 1;
      const year = createWalletDto.year ?? now.getFullYear();

      // Create entity with audit fields
      const wallet = this.walletRepository.create({
        ...createWalletDto,
        month,
        year,
        created_by: logged?.name || 'system',
        created_id: logged?.id || null,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Save entity
      return await this.walletRepository.save(wallet);
    } catch (error) {
      throw new BadRequestException(`Failed to create Wallet: ${error.message}`);
    }
  }
}
