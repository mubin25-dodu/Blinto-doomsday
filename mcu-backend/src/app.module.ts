import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'mcu-backend',
    }),
    TypeOrmModule.forRoot({
    type:'postgres',
    host: process.env.DBHost ?? 'localhost',
    port: Number(process.env.DBport ?? 5432),
    username: process.env.DBusername,
    password: process.env.DBpassword,
    database: process.env.database,
    extra: {
      options: `-c timezone=${process.env.DBtimezone ?? 'Asia/Dhaka'}`,
    },
    autoLoadEntities:true,
    synchronize: false,
    migrationsRun: true,
    migrations: ['dist/database/migrations/*.js'],
  }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
