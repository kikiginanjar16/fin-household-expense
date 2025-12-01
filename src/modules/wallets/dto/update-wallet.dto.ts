import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';


export class UpdateWalletDto {
  @ApiProperty({
    description: 'Wallet name for grouping expenses and incomes',
    example: 'Dompet Rumah Tangga'
  })
  @IsOptional()
  public name: string | undefined;

  @ApiProperty({
    description: 'Currency used for this wallet',
    example: 'IDR'
  })
  @IsOptional()
  public currency: string | undefined;

  @ApiProperty({
    description: 'Initial balance of the wallet (optional for MVP)'
  })
  @IsOptional()
  public initial_balance: number | undefined;

  @ApiProperty({
    description: 'Whether this is the default wallet',
    example: 'true'
  })
  @IsOptional()
  public is_default: boolean | undefined;

  @ApiProperty({
    description: 'Target month for this wallet record',
    example: 1,
    minimum: 1,
    maximum: 12,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  public month: number | undefined;

  @ApiProperty({
    description: 'Target year for this wallet record',
    example: 2024,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  public year: number | undefined;

}
