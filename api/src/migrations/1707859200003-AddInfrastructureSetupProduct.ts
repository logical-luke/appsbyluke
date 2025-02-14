import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInfrastructureSetupProduct1707859200003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders 
      MODIFY COLUMN productName ENUM('startupCore', 'startupPlus', 'startupPro', 'ciCdIntegration', 'infrastructureSetup') 
      COLLATE utf8mb4_unicode_ci NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE orders 
      MODIFY COLUMN productName ENUM('startupCore', 'startupPlus', 'startupPro', 'ciCdIntegration') 
      COLLATE utf8mb4_unicode_ci NOT NULL
    `);
  }
}
