import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovies1763550000000 implements MigrationInterface {
  name = 'CreateMovies1763550000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    if (!(await queryRunner.hasTable('movies'))) {
      await queryRunner.query(`
        CREATE TABLE "movies" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "title" character varying(255) NOT NULL,
          "release_year" integer NOT NULL,
          "runtime_minutes" integer NOT NULL,
          "watched" boolean NOT NULL DEFAULT false,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_movies_title" UNIQUE ("title"),
          CONSTRAINT "PK_movies_id" PRIMARY KEY ("id")
        )
      `);
    }

    if (!(await queryRunner.hasTable('movie_prerequisites'))) {
      await queryRunner.query(`
        CREATE TABLE "movie_prerequisites" (
          "movie_id" uuid NOT NULL,
          "prerequisite_id" uuid NOT NULL,
          CONSTRAINT "PK_movie_prerequisites" PRIMARY KEY ("movie_id", "prerequisite_id"),
          CONSTRAINT "FK_movie_prerequisites_movie" FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE,
          CONSTRAINT "FK_movie_prerequisites_prerequisite" FOREIGN KEY ("prerequisite_id") REFERENCES "movies" ("id") ON DELETE CASCADE,
          CONSTRAINT "CHK_movie_prerequisites_not_self" CHECK ("movie_id" <> "prerequisite_id")
        )
      `);
    }

    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_movie_prerequisites_movie_id" ON "movie_prerequisites" ("movie_id")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_movie_prerequisites_prerequisite_id" ON "movie_prerequisites" ("prerequisite_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_movie_prerequisites_prerequisite_id"');
    await queryRunner.query('DROP INDEX "IDX_movie_prerequisites_movie_id"');
    await queryRunner.query('DROP TABLE "movie_prerequisites"');
    await queryRunner.query('DROP TABLE "movies"');
  }
}
