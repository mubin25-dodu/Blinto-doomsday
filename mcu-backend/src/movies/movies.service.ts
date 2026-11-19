import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { Movie } from './entities/movie.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviePrerequisite } from './entities/movie-prerequisite.entity.js';
import { In, Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private moviesRepository: Repository<Movie>) {}

  async create(createMovieDto: CreateMovieDto) {
    const { prerequisites = [], ...movieData } = createMovieDto;

    return this.moviesRepository.manager.transaction(async (manager) => {
      const moviesRepository = manager.getRepository(Movie);
      const linksRepository = manager.getRepository(MoviePrerequisite);
      const movie = await moviesRepository.save(moviesRepository.create(movieData));
      const prerequisiteIds = [...new Set(prerequisites)];

      if (prerequisiteIds.length === 0) return movie;

      const prerequisiteMovies = await moviesRepository.findBy({
        id: In(prerequisiteIds),
      });

      if (prerequisiteMovies.length !== prerequisiteIds.length) {
        throw new BadRequestException('One or more prerequisite movies were not found');
      }

      await linksRepository.save(
        prerequisiteMovies.map((prerequisite) =>
          linksRepository.create({ movie, prerequisite }),
        ),
      );

      return movie;
    });
  }

  async findAll() {
    return await this.moviesRepository.find( );
  }

  async findOne(id: string) {
    return await this.moviesRepository.findOne({ where: { id:id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return await this.moviesRepository.update(id, updateMovieDto);
  }

  async remove(id: string) {
    // return await this.moviesRepository.remove({ id });
  }

  async getWatchOrder(movieId: string): Promise<Movie[]> {
    return this.getTheMOvieChain(movieId);
  }


  async getTheMOvieChain(movieId: string): Promise<Movie[]> {
    const root = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: { prerequisiteLinks: { prerequisite: true } },
    });

    if (!root) return [];

    const visited = new Set<string>([root.id]);
    const chain: Movie[] = [];

    const visit = async (movie: Movie): Promise<void> => {
      for (const link of movie.prerequisiteLinks ?? []) {
        const prerequisite = link.prerequisite;
        if (visited.has(prerequisite.id)) continue;
        visited.add(prerequisite.id);

        const expanded = await this.moviesRepository.findOne({
          where: { id: prerequisite.id },
          relations: { prerequisiteLinks: { prerequisite: true } },
        });

        if (!expanded) continue;

        await visit(expanded);
        chain.push(expanded);
      }
    };

    await visit(root);
    return chain;
  }

  async circulerDependencyCheck(movieId: string, prerequisiteId: string): Promise<boolean|null> {
    const isCircular = await this.hasPrerequisitePath(
      prerequisiteId,
      movieId,
      new Set<string>(),
    );

    if (isCircular) {
      throw new ConflictException({
        statusCode: 409,
        message: `Circular dependency detected: Movie ${movieId} is already a prerequisite of Movie ${prerequisiteId}`,
      });
    }
    return false;
  }

  private async hasPrerequisitePath(
    currentMovieId: string,
    targetMovieId: string,
    visited: Set<string>,
  ): Promise<boolean> {
    if (currentMovieId === targetMovieId) return true;
    if (visited.has(currentMovieId)) return false;
    visited.add(currentMovieId);

    const currentMovie = await this.moviesRepository.findOne({
      where: { id: currentMovieId },
      relations: { prerequisiteLinks: { prerequisite: true } },
    });

    if (!currentMovie) return false;

    for (const link of currentMovie.prerequisiteLinks ?? []) {
      if (
        await this.hasPrerequisitePath(
          link.prerequisite.id,
          targetMovieId,
          visited,
        )
      ) {
        return true;
      }
    }

    return false;
  }
}
