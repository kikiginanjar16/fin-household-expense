import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../../../entities/planning.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class DeletePlanningUseCase {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(id: string, logged?: LoggedUser): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      // Check if entity exists and is not already soft-deleted
      const planning = await this.planningRepository.findOne({ where: { id, deleted_at: null } });
      if (!planning) {
        throw new NotFoundException(`Planning with ID ${id} not found or has been deleted`);
      }

      // Perform soft delete with audit fields
      const result = await this.planningRepository.softDelete({
        id,
        deleted_at: null,
      });

      if (result.affected > 0) {
        await this.planningRepository.update(id, {
          deleted_by: logged?.name || 'system',
          deleted_id: logged?.id || null,
        });
      }

      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete Planning: ${error.message}`);
    }
  }
}