import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1642917120537 implements MigrationInterface {
  name = 'UserMigration1642917120537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(60) NOT NULL, \`phone_number\` varchar(255) NULL, \`isConfirmed\` tinyint NOT NULL DEFAULT 0, \`confirmToken\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
