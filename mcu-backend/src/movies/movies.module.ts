import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { MoviesController } from './movies.controller.js';
import { Movie } from './entities/movie.entity.js';
import { MoviePrerequisite } from './entities/movie-prerequisite.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MoviePrerequisite])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
