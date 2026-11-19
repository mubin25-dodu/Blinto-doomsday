import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Get("check-circular-dependency/:movieId/:prerequisiteId")
  async checkCircularDependency(
    @Param('movieId') movieId: string,
    @Param('prerequisiteId') prerequisiteId: string
  ) {
    return this.moviesService.circulerDependencyCheck(movieId, prerequisiteId);
  }

  @Get("/:id/watchorder")
  async getWatchOrder(@Param('id') id: string) {
   return this.moviesService.getWatchOrder(id);
  }
}
