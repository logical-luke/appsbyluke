import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrderStatus1707859200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['new', 'in_progress', 'completed'],
        default: "'new'"
      })
    );

    await queryRunner.changeColumn(
      'orders',
      'productName',
      new TableColumn({
        name: 'productName',
        type: 'enum',
        enum: ['startupCore', 'startupPlus', 'startupPro', 'ciCdIntegration']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert productName to varchar
    await queryRunner.changeColumn(
      'orders',
      'productName',
      new TableColumn({
        name: 'productName',
        type: 'varchar',
        length: '255'
      })
    );

    // Drop status column
    await queryRunner.dropColumn('orders', 'status');
  }
}
