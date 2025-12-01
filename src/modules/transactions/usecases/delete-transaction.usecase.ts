import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../entities/transaction.entity';
import { Planning, PlanningStatus } from '../../../entities/planning.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(id: string, logged?: LoggedUser): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      // Check if entity exists and is not already soft-deleted
      const transaction = await this.transactionRepository.findOne({ where: { id, deleted_at: null } });
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found or has been deleted`);
      }

      // Rollback planning status when needed
      if (transaction.is_planned && transaction.planning_id) {
        const planning = await this.planningRepository.findOne({
          where: { id: transaction.planning_id, deleted_at: null },
        });

        if (planning) {
          await this.planningRepository.update(planning.id, {
            status: PlanningStatus.OPEN,
            updated_by: logged?.name || 'system',
            updated_id: logged?.id || null,
          });
        }
      }

      // Perform soft delete with audit fields
      const result = await this.transactionRepository.softDelete({
        id : id
      });

      if (result.affected > 0) {
        await this.transactionRepository.update(id, {
          deleted_by: logged?.name || 'system',
          deleted_id: logged?.id || null,
        });
      }

      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete Transaction: ${error.message}`);
    }
  }
}
