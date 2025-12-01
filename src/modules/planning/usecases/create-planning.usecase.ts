import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../../../entities/planning.entity';
import { CreatePlanningDto } from '../dto/create-planning.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class CreatePlanningUseCase {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(createPlanningDto: CreatePlanningDto, logged?: LoggedUser): Promise<Planning> {
    try {
      // Validate DTO
      if (!createPlanningDto) {
        throw new BadRequestException('CreatePlanningDto is required');
      }

      // Create entity with audit fields
      const planning = this.planningRepository.create({
        ...createPlanningDto,
        created_by: logged?.name || 'system',
        created_id: logged?.id || null,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Save entity
      return await this.planningRepository.save(planning);
    } catch (error) {
      throw new BadRequestException(`Failed to create Planning: ${error.message}`);
    }
  }
}