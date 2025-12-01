import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type:'varchar', nullable: false, length: 100 })
  public name: string;

  @Column({type:'enum', enum: ['expense', 'income'] })
  public type: CategoryType;

  @Column({type:'varchar', length: 20, nullable: true })
  public color: string;
  
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