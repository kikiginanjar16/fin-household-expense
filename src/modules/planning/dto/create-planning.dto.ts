import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty, IsUUID, IsEnum, IsArray } from 'class-validator';

export enum PlannedType {
  EXPENSE = 'expense',
  INCOME = 'income',
}
export enum PlanningStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DONE = 'done',
}

export class CreatePlanningDto {
  @ApiProperty({
    description: 'ID of the wallet this planning belongs to',
    example: '323e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4')
  @IsOptional()
  public wallet_id: string | undefined;

  @ApiProperty({
    description: 'ID of the category for this planning item (optional for generic planning)',
    example: '423e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4')
  @IsOptional()
  public category_id: string | undefined;

  @ApiProperty({
    description: 'Whether this is planned expense or income',
    enum: PlannedType,
    example: 'expense'
  })
  @IsEnum(PlannedType)
  @IsOptional()
  public planned_type: PlannedType | undefined;

  @ApiProperty({
    description: 'Planned amount for this category in the given month',
    example: '1500000'
  })
  @IsOptional()
  public planned_amount: number | undefined;

  @ApiProperty({
    description: 'Optional note for this planning item',
    example: 'Kurangi jajan kopi, fokus masak di rumah'
  })
  @IsOptional()
  public note: string | undefined;

  @ApiProperty({
    description: 'Status of the planning item',
    enum: PlanningStatus,
    example: 'open'
  })
  @IsEnum(PlanningStatus)
  @IsOptional()
  public status: PlanningStatus | undefined;

}
