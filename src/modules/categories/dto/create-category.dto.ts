import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name for grouping transactions',
    example: 'Makan &amp; Minum'
  })
  @IsOptional()
  public name: string | undefined;

  @ApiProperty({
    description: 'Whether this category is for expense or income',
    enum: CategoryType,
    example: 'expense'
  })
  @IsEnum(CategoryType)
  @IsOptional()
  public type: CategoryType | undefined;

  @ApiProperty({
    description: 'Color used in UI for this category',
    example: '#FFB347'
  })
  @IsOptional()
  public color: string | undefined;
}