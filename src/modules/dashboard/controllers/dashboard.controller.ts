import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { GetDashboardUseCase } from '../usecases/get-dashboard.usecase';
import { JWT_ACCESS_TOKEN } from 'src/common/constant/constant';

@ApiTags('dashboard')
@ApiBearerAuth(JWT_ACCESS_TOKEN)
@Controller({ version: '1', path: 'dashboard' })
export class DashboardController {
  constructor(private readonly getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get overall and per-wallet performance' })
  @ApiQuery({ name: 'start_date', required: false, type: String, description: 'Filter start date (inclusive) YYYY-MM-DD' })
  @ApiQuery({ name: 'end_date', required: false, type: String, description: 'Filter end date (inclusive) YYYY-MM-DD' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDashboard(
    @Res() res: Response,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    try {
      const data = await this.getDashboardUseCase.execute({
        start_date,
        end_date,
      });

      return res.status(200).json({
        status: true,
        message: 'Dashboard retrieved successfully',
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
