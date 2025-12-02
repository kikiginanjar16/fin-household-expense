import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../entities/category.entity';

interface LoggedUser { id: string; name: string }

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async execute(id: string, logged?: LoggedUser): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }

      // Check if entity exists and is not already soft-deleted
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found or has been deleted`);
      }

      // Perform soft delete with audit fields
      const result = await this.categoryRepository.softDelete({
        id: id
      });

      if (result.affected > 0) {
        await this.categoryRepository.update(id, {
          deleted_by: logged?.name || 'system',
          deleted_id: logged?.id || null,
        });
      }

      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete Category: ${error.message}`);
    }
  }
}