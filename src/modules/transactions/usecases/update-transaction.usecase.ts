import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Planning, PlanningStatus } from '../../../entities/planning.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(id: string, updateTransactionDto: UpdateTransactionDto, logged?: LoggedUser): Promise<Transaction> {
    try {
      // Validate inputs
      if (!id || !updateTransactionDto) {
        throw new BadRequestException('ID and UpdateTransactionDto are required');
      }

      // Check if entity exists and is not soft-deleted
      const transaction = await this.transactionRepository.findOne({ where: { id, deleted_at: null } });
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found or has been deleted`);
      }

      if (updateTransactionDto.is_planned) {
        if (!updateTransactionDto.planning_id && !transaction.planning_id) {
          throw new BadRequestException('planning_id is required when is_planned is true');
        }

        const planningId = updateTransactionDto.planning_id ?? transaction.planning_id;
        const planning = await this.planningRepository.findOne({
          where: { id: planningId, deleted_at: null },
        });

        if (!planning) {
          throw new BadRequestException(`Planning with ID ${planningId} not found`);
        }

        await this.planningRepository.update(planning.id, {
          status: PlanningStatus.DONE,
          updated_by: logged?.name || 'system',
          updated_id: logged?.id || null,
        });
      }

      // Update entity with audit fields
      await this.transactionRepository.update(id, {
        ...updateTransactionDto,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Return updated entity
      return await this.transactionRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Transaction: ${error.message}`);
    }
  }
}
