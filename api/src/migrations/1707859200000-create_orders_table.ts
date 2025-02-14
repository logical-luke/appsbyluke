import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1707859200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'productName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'customerEmail',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'orderDate',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
