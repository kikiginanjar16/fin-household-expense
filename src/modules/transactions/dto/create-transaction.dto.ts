import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, ValidateIf } from 'class-validator';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the wallet this transaction belongs to',
    example: '323e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4')
  @IsOptional()
  public wallet_id: string | undefined;

  @ApiProperty({
    description: 'ID of the category for this transaction',
    example: '423e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4')
  @IsOptional()
  public category_id: string | undefined;

  @ApiProperty({
    description: 'Type of transaction (expense or income)',
    enum: TransactionType,
    example: 'expense'
  })
  @IsEnum(TransactionType)
  @IsOptional()
  public type: TransactionType | undefined;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: '50000'
  })
  @IsOptional()
  public amount: number | undefined;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2025-12-01'
  })
  @IsOptional()
  public transaction_date: Date | undefined;

  @ApiProperty({
    description: 'Optional note for the transaction',
    example: 'Makan siang di warung dekat kantor'
  })
  @IsOptional()
  public note: string | undefined;

  @ApiProperty({
    description: 'Marks whether this is a planned transaction for monthly planning'
  })
  @IsOptional()
  public is_planned: boolean | undefined;

  @ApiProperty({
    description: 'Planning ID linked to this transaction when is_planned is true',
    example: '523e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @ValidateIf((o) => o.is_planned === true)
  @IsUUID('4')
  public planning_id: string | undefined;

}
