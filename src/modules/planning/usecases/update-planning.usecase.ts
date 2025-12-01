import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../../../entities/planning.entity';
import { UpdatePlanningDto } from '../dto/update-planning.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class UpdatePlanningUseCase {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(id: string, updatePlanningDto: UpdatePlanningDto, logged?: LoggedUser): Promise<Planning> {
    try {
      // Validate inputs
      if (!id || !updatePlanningDto) {
        throw new BadRequestException('ID and UpdatePlanningDto are required');
      }

      // Check if entity exists and is not soft-deleted
      const planning = await this.planningRepository.findOne({ where: { id, deleted_at: null } });
      if (!planning) {
        throw new NotFoundException(`Planning with ID ${id} not found or has been deleted`);
      }

      // Update entity with audit fields
      await this.planningRepository.update(id, {
        ...updatePlanningDto,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Return updated entity
      return await this.planningRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Planning: ${error.message}`);
    }
  }
}