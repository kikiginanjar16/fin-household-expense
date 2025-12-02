import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';

interface LoggedUser { id: string; name: string }

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async execute(id: string, updateCategoryDto: UpdateCategoryDto, logged?: LoggedUser): Promise<Category> {
    try {
      // Validate inputs
      if (!id || !updateCategoryDto) {
        throw new BadRequestException('ID and UpdateCategoryDto are required');
      }

      // Check if entity exists and is not soft-deleted
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found or has been deleted`);
      }

      // Update entity with audit fields
      await this.categoryRepository.update(id, {
        ...updateCategoryDto,
        updated_by: logged?.name || 'system',
        updated_id: logged?.id || null,
      });

      // Return updated entity
      return await this.categoryRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Category: ${error.message}`);
    }
  }
}