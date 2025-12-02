import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../entities/category.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async execute(id: string, relations: string[] = [], logged?: LoggedUser): Promise<Category | null> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      const category = await this.categoryRepository.findOne({ 
        where: { id },
        relations,
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found or has been deleted`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to retrieve Category: ${error.message}`);
    }
  }

  async paginate(
    page = 1,
    limit = 10,
    filters: any = {},
    relations: string[] = [],
    logged?: LoggedUser
  ): Promise<{ data: Category[], meta: { total: number, page: number, total_page: number } }> {
    try {
      if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be positive numbers');
      }

      const where = { ...filters };
      const [data, total] = await this.categoryRepository.findAndCount({
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
      throw new BadRequestException(`Failed to retrieve Categorys: ${error.message}`);
    }
  }
}