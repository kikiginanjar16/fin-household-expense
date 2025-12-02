import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../../../entities/planning.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class GetPlanningUseCase {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async execute(id: string, relations: string[] = [], logged?: LoggedUser): Promise<Planning | null> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      const planning = await this.planningRepository.findOne({ 
        where: { id : id },
        relations,
      });

      if (!planning) {
        throw new NotFoundException(`Planning with ID ${id} not found or has been deleted`);
      }

      return planning;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to retrieve Planning: ${error.message}`);
    }
  }

  async paginate(
    page = 1,
    limit = 10,
    filters: any = {},
    relations: string[] = [],
    logged?: LoggedUser
  ): Promise<{ data: Planning[], meta : { total: number; page: number; total_page: number } }> {
    try {
      if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      const where = { ...filters };
      const [data, total] = await this.planningRepository.findAndCount({
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
      throw new BadRequestException(`Failed to retrieve Plannings: ${error.message}`);
    }
  }
}