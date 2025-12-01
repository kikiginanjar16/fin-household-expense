import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum PlannedType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export enum PlanningStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DONE = 'done'
}

@Entity()
export class Planning {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type:'uuid', nullable: false })
  public wallet_id: string;

  @Column({type:'uuid', nullable: true })
  public category_id: string;

  @Column({type:'enum', enum: ['expense', 'income'] })
  public planned_type: PlannedType;

  @Column({type:'float', nullable: true })
  public planned_amount: number;

  @Column({type:'text', nullable: true })
  public note: string;

  @Column({type:'enum', enum: ['open', 'closed', 'done'] })
  public status: PlanningStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public created_by: string;

  @Column({ type: 'uuid', nullable: true })
  public created_id: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public updated_by: string;

  @Column({ type: 'uuid', nullable: true })
  public updated_id: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public deleted_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public deleted_by: string;

  @Column({ type: 'uuid', nullable: true })
  public deleted_id: string;
}
