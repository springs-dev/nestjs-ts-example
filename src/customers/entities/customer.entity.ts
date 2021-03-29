import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';

@Entity('customers')
export class CustomerEntity {
  @Expose()
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  email?: string;

  @Exclude()
  @Column({ nullable: false, select: false })
  password?: string;

  @Expose()
  @Column({ nullable: true })
  name?: string;

  @Expose()
  @Column({ nullable: true })
  phoneNumber?: string;

  @Expose()
  @Column({ nullable: true })
  address?: string;

  @Expose()
  @CreateDateColumn()
  createdAt?: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt?: Date;

  @Expose()
  @Column({ nullable: true })
  acceptedAt?: Date;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }
}
