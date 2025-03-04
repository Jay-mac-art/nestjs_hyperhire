import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PriceRecord {
  // Unique identifier for each price record
  @PrimaryGeneratedColumn()
  id: number;

  // Asset identifier (e.g., 'ETH' for Ethereum, 'MATIC' for Polygon)
  @Column()
  asset: string;

  // Price of the asset in USD, stored as a decimal for precision
  @Column('decimal')
  priceUsd: number;

  // Timestamp when the record was created, serves as the price fetch time
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  // Timestamp of the last update (though price records are typically immutable)
  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete flag, defaults to false
  @Column({ default: false })
  isDeleted: boolean;
}