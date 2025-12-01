import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTransactionUseCase } from '../usecases/create-transaction.usecase';
import { GetTransactionUseCase } from '../usecases/get-transaction.usecase';
import { UpdateTransactionUseCase } from '../usecases/update-transaction.usecase';
import { DeleteTransactionUseCase } from '../usecases/delete-transaction.usecase';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from 'src/entities/transaction.entity';
import { JWT_ACCESS_TOKEN } from 'src/common/constant/constant';

@ApiTags('transactions')
@ApiBearerAuth(JWT_ACCESS_TOKEN)
@Controller({ version: '1', path: 'transactions' })
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createTransactionDto: CreateTransactionDto, @Res() res: Response) {
    try {
      const data : any = await this.createTransactionUseCase.execute(createTransactionDto, res.locals.logged);
      return res.status(201).json({
        status: true,
        message: 'Transaction created successfully',
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
  @ApiOperation({ summary: 'Get all Transactions' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 }) 
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  async findAll(
    @Res() res: Response, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('wallet_id') wallet_id: string | undefined,
    @Query('category_id') category_id: string | undefined,
    @Query('type') type: TransactionType | undefined,
    @Query('amount') amount: number | undefined,
    @Query('transaction_date') transaction_date: Date | undefined,
    @Query('note') note: string | undefined,
    @Query('is_planned') is_planned: boolean | undefined,
  ) {
    try {
      const whereConditions : any = {};
      if(wallet_id){
          whereConditions['wallet_id'] = wallet_id;
      }
      if(category_id){
          whereConditions['category_id'] = category_id;
      }
      if(type){
          whereConditions['type'] = type;
      }
      if(amount){
          whereConditions['amount'] = amount;
      }
      if(transaction_date){
          whereConditions['transaction_date'] = transaction_date;
      }
      if(note){
          whereConditions['note'] = note;
      }
      if(is_planned){
          whereConditions['is_planned'] = is_planned;
      }

      const data = await this.getTransactionUseCase.paginate(page, limit, whereConditions, [], res.locals.logged);
      return res.status(200).json({
        status: true,
        message: 'Transactions retrieved successfully',
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
  @ApiOperation({ summary: 'Get a Transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Transaction', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.getTransactionUseCase.execute(id);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Transaction not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Transaction retrieved successfully',
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
  @ApiOperation({ summary: 'Update a Transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Transaction', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Res() res: Response) {
    try {
      const data = await this.updateTransactionUseCase.execute(id, updateTransactionDto, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Transaction not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Transaction updated successfully',
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
  @ApiOperation({ summary: 'Soft delete a Transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the Transaction', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.deleteTransactionUseCase.execute(id, res.locals.logged);
      if (!data) {
        return res.status(404).json({
          status: false,
          message: 'Transaction not found',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Transaction deleted successfully',
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