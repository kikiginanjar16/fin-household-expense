import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async execute(createCategoryDto: CreateCategoryDto, logged?: LoggedUser): Promise<Category> {
    try {
      // Validate DTO
      if (!createCategoryDto) {
        throw new BadRequestException('CreateCategoryDto is required');
      }

      // Create entity with audit fields
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        created_by: logged?.name || 'system',
        created_id: logged?.id || null,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Save entity
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new BadRequestException(`Failed to create Category: ${error.message}`);
    }
  }
}