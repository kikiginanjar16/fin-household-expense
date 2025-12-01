import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Planning, PlanningStatus } from '../../../entities/planning.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(createTransactionDto: CreateTransactionDto, logged?: LoggedUser): Promise<Transaction> {
    try {
      // Validate DTO
      if (!createTransactionDto) {
        throw new BadRequestException('CreateTransactionDto is required');
      }

      if (createTransactionDto.is_planned) {
        if (!createTransactionDto.planning_id) {
          throw new BadRequestException('planning_id is required when is_planned is true');
        }

        const planning = await this.planningRepository.findOne({
          where: { id: createTransactionDto.planning_id, deleted_at: null },
        });

        if (!planning) {
          throw new BadRequestException(`Planning with ID ${createTransactionDto.planning_id} not found`);
        }

        await this.planningRepository.update(planning.id, {
          status: PlanningStatus.DONE,
          updated_by: logged?.name || 'system',
          updated_id: logged?.id || null,
        });
      }

      // Create entity with audit fields
      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        created_by: logged?.name || 'system',
        created_id: logged?.id || null,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Save entity
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException(`Failed to create Transaction: ${error.message}`);
    }
  }
}
