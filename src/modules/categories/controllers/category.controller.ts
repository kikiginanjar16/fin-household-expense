import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateCategoryUseCase } from '../usecases/create-category.usecase';
import { GetCategoryUseCase } from '../usecases/get-category.usecase';
import { UpdateCategoryUseCase } from '../usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../usecases/delete-category.usecase';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryType } from 'src/entities/category.entity';
import { JWT_ACCESS_TOKEN } from 'src/common/constant/constant';

@ApiTags('categories')
@ApiBearerAuth(JWT_ACCESS_TOKEN)
@Controller({ version: '1', path: 'categories' })
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response) {
    try {
      const data : any = await this.createCategoryUseCase.execute(createCategoryDto, res.locals.logged);
      return res.status(201).json({
        status: true,
        message: 'Category created successfully',
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

  @Get()
  @ApiOperation({ summary: 'Get all Categorys' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 }) 
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  async findAll(
    @Res() res: Response, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('name') name: string | undefined,
    @Query('type') type: CategoryType | undefined,
    @Query('color') color: string | undefined,
    @Query('icon') icon: string | undefined,
  ) {
    try {
      const whereConditions : any = {};
      if(name){
          whereConditions['name'] = name;
      }
      if(type){
          whereConditions['type'] = type;
      }
      if(color){
          whereConditions['color'] = color;
      }
      if(icon){
          whereConditions['icon'] = icon;
      }

      const data = await this.getCategoryUseCase.paginate(page, limit, whereConditions, [], res.locals.logged);
      return res.status(200).json({
        status: true,
        message: 'Categorys retrieved successfully',
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Category', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.getCategoryUseCase.execute(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Category retrieved successfully',
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
  @ApiOperation({ summary: 'Update a Category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Category', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
    try {
      const data = await this.updateCategoryUseCase.execute(id, updateCategoryDto, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Category updated successfully',
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
  @ApiOperation({ summary: 'Soft delete a Category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Category', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.deleteCategoryUseCase.execute(id, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Category deleted successfully',
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