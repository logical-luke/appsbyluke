import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum OrderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum ProductName {
  STARTUP_CORE = 'startupCore',
  STARTUP_PLUS = 'startupPlus',
  STARTUP_PRO = 'startupPro',
  CICD_INTEGRATION = 'ciCdIntegration',
  INFRASTRUCTURE_SETUP = 'infrastructureSetup'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255
  })
  productName: string;

  @Column()
  customerEmail: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW
  })
  status: OrderStatus;

  @CreateDateColumn()
  orderDate: Date;
}
