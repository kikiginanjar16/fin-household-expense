import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type:'varchar', nullable: false, length: 150 })
  public name: string;

  @Column({type:'varchar', nullable: false, length: 10 })
  public currency: string;

  @Column({ type: 'int', nullable: true })
  public month: number;

  @Column({ type: 'int', nullable: true })
  public year: number;

  @Column({type:'float', nullable: true })
  public initial_balance: number;
  
  @Column({type:'boolean', nullable: true })
  public is_default: boolean;

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