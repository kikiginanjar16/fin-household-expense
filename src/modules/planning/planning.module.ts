import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningController } from './controllers/planning.controller';
import { CreatePlanningUseCase } from './usecases/create-planning.usecase';
import { GetPlanningUseCase } from './usecases/get-planning.usecase';
import { UpdatePlanningUseCase } from './usecases/update-planning.usecase';
import { DeletePlanningUseCase } from './usecases/delete-planning.usecase';
import { Planning } from '../../entities/planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planning])],
  controllers: [PlanningController],
  providers: [
    CreatePlanningUseCase,
    GetPlanningUseCase,
    UpdatePlanningUseCase,
    DeletePlanningUseCase,
  ],
})
export class PlanningModule {}