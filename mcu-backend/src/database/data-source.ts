import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity.js';
import { MoviePrerequisite } from '../movies/entities/movie-prerequisite.entity.js';

import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });

export default new DataSource({
  type: 'postgres',
  host: process.env.DBHost ?? 'localhost',
  port: Number(process.env.DBport ?? 5432),
  username: process.env.DBusername,
  password: process.env.DBpassword,
  database: process.env.database,
  extra: {
    options: `-c timezone=${process.env.DBtimezone ?? 'Asia/Dhaka'}`,
  },
  entities: [Movie, MoviePrerequisite],
  migrations: ['dist/database/migrations/*.js'],
});
