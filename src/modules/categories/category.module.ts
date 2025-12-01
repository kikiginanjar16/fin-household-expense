import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { GetCategoryUseCase } from './usecases/get-category.usecase';
import { UpdateCategoryUseCase } from './usecases/update-category.usecase';
import { DeleteCategoryUseCase } from './usecases/delete-category.usecase';
import { Category } from '../../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
})
export class CategoryModule {}