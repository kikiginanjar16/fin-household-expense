import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, ManyToMany, OneToOne } from 'typeorm';


export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income'
}


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type:'uuid', nullable: false })
  public wallet_id: string;
  @Column({type:'uuid',  })
  public category_id: string;
  @Column({type:'enum', enum: ['expense', 'income'] })
  public type: TransactionType;
  @Column({type:'float',  })
  public amount: number;
  @Column({type:'date', nullable: false })
  public transaction_date: Date;
  @Column({type:'text',  })
  public note: string;
  @Column({type:'boolean',  })
  public is_planned: boolean;
  @Column({type:'uuid', nullable: true })
  public planning_id: string;

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
