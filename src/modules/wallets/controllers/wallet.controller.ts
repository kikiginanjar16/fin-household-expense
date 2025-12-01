import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateWalletUseCase } from '../usecases/create-wallet.usecase';
import { GetWalletUseCase } from '../usecases/get-wallet.usecase';
import { UpdateWalletUseCase } from '../usecases/update-wallet.usecase';
import { DeleteWalletUseCase } from '../usecases/delete-wallet.usecase';

import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { JWT_ACCESS_TOKEN } from 'src/common/constant/constant';

@ApiTags('wallets')
@ApiBearerAuth(JWT_ACCESS_TOKEN)
@Controller({ version: '1', path: 'wallets' })
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
    private readonly deleteWalletUseCase: DeleteWalletUseCase,
    
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Wallet' })
  @ApiBody({ type: CreateWalletDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createWalletDto: CreateWalletDto, @Res() res: Response) {
    try {
      const data : any = await this.createWalletUseCase.execute(createWalletDto, res.locals.logged);
      return res.status(201).json({
        status: true,
        message: 'Wallet created successfully',
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
  @ApiOperation({ summary: 'Get all Wallets' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 }) 
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'month', required: false, type: Number, description: 'Month of the wallet record' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year of the wallet record' })
  async findAll(
    @Res() res: Response, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('name') name: string | undefined,
    @Query('currency') currency: string | undefined,
    @Query('initial_balance') initial_balance: number | undefined,
    @Query('is_default') is_default: boolean | undefined,
    @Query('month') month: number | undefined,
    @Query('year') year: number | undefined,
  ) {
    try {
      const whereConditions : any = {};
      if(name){
          whereConditions['name'] = name;
      }

      if(currency){
          whereConditions['currency'] = currency;
      }

      if(initial_balance){
          whereConditions['initial_balance'] = initial_balance;
      }

      if(is_default){
          whereConditions['is_default'] = is_default;
      }

      if(month){
          whereConditions['month'] = month;
      }

      if(year){
          whereConditions['year'] = year;
      }

      const data = await this.getWalletUseCase.paginate(page, limit, whereConditions, [], res.locals.logged);
      return res.status(200).json({
        status: true,
        message: 'Wallets retrieved successfully',
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
  @ApiOperation({ summary: 'Get a Wallet by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Wallet', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.getWalletUseCase.execute(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Wallet not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Wallet retrieved successfully',
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
  @ApiOperation({ summary: 'Update a Wallet by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Wallet', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto, @Res() res: Response) {
    try {
      const data = await this.updateWalletUseCase.execute(id, updateWalletDto, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Wallet not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Wallet updated successfully',
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
  @ApiOperation({ summary: 'Soft delete a Wallet by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Wallet', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.deleteWalletUseCase.execute(id, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Wallet not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Wallet deleted successfully',
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
