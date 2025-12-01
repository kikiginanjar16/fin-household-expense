import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePlanningUseCase } from '../usecases/create-planning.usecase';
import { GetPlanningUseCase } from '../usecases/get-planning.usecase';
import { UpdatePlanningUseCase } from '../usecases/update-planning.usecase';
import { DeletePlanningUseCase } from '../usecases/delete-planning.usecase';

import { CreatePlanningDto } from '../dto/create-planning.dto';
import { PlannedType, UpdatePlanningDto } from '../dto/update-planning.dto';
import { PlanningStatus } from 'src/entities/planning.entity';

@ApiTags('plannings')
@Controller({ version: '1', path: 'plannings' })
export class PlanningController {
  constructor(
    private readonly createPlanningUseCase: CreatePlanningUseCase,
    private readonly getPlanningUseCase: GetPlanningUseCase,
    private readonly updatePlanningUseCase: UpdatePlanningUseCase,
    private readonly deletePlanningUseCase: DeletePlanningUseCase,
    
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Planning' })
  @ApiBody({ type: CreatePlanningDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createPlanningDto: CreatePlanningDto, @Res() res: Response) {
    try {
      const data : any = await this.createPlanningUseCase.execute(createPlanningDto, res.locals.logged);
      return res.status(201).json({
        status: true,
        message: 'Planning created successfully',
        data: data
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Plannings' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 }) 
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  async findAll(
    @Res() res: Response, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('wallet_id') wallet_id: string | undefined,
    @Query('category_id') category_id: string | undefined,
    @Query('planned_type') planned_type: PlannedType | undefined,
    @Query('planned_amount') planned_amount: number | undefined,
    @Query('note') note: string | undefined,
    @Query('status') status: PlanningStatus | undefined,
  ) {
    try {
      const whereConditions : any = {};
      if(wallet_id){
          whereConditions['wallet_id'] = wallet_id;
      }
      if(category_id){
          whereConditions['category_id'] = category_id;
      }
      if(planned_type){
          whereConditions['planned_type'] = planned_type;
      }
      if(planned_amount){
          whereConditions['planned_amount'] = planned_amount;
      }
      if(note){
          whereConditions['note'] = note;
      }
      if(status){
          whereConditions['status'] = status;
      }

      const data : any = await this.getPlanningUseCase.paginate(page, limit, whereConditions, [], res.locals.logged);
      return res.status(200).json({
        status: true,
        message: 'Plannings retrieved successfully',
        data: data?.data,
        meta: data?.meta
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Planning by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Planning', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.getPlanningUseCase.execute(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Planning not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Planning retrieved successfully',
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Planning by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Planning', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdatePlanningDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(@Param('id') id: string, @Body() updatePlanningDto: UpdatePlanningDto, @Res() res: Response) {
    try {
      const data = await this.updatePlanningUseCase.execute(id, updatePlanningDto, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Planning not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Planning updated successfully',
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a Planning by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Planning', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.deletePlanningUseCase.execute(id, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Planning not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Planning deleted successfully',
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  
}