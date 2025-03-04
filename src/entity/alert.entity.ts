import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  // Unique identifier for each alert
  @PrimaryGeneratedColumn()
  id: number;

  // Blockchain chain (e.g., 'ethereum' for ETH, 'polygon' for MATIC)
  @Column()
  chain: string;

  // Target price in USD at which to trigger the alert
  @Column('decimal')
  targetPrice: number;

  // Email address to send the notification to
  @Column()
  email: string;

  // Status of the alert (active or inactive), defaults to true
  @Column({ default: true })
  isActive: boolean;

  // Timestamp when the alert was created
  @CreateDateColumn()
  createdAt: Date;

  // Timestamp of the last update (e.g., when isActive changes)
  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete flag, defaults to false
  @Column({ default: false })
  isDeleted: boolean;
}