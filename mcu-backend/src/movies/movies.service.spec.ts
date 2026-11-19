import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { MoviePrerequisite } from './entities/movie-prerequisite.entity.js';
import { Movie } from './entities/movie.entity.js';
import { MoviesService } from './movies.service.js';

describe('MoviesService', () => {
  let service: MoviesService;
  const moviesRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    moviesRepository.findOne.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: moviesRepository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns transitive prerequisites without duplicates', async () => {
    const makeMovie = (id: string): Movie => ({
      id,
      title: id,
      releaseYear: 2020,
      runtimeMinutes: 100,
      watched: false,
      prerequisiteLinks: [],
      dependentLinks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const link = (movie: Movie, prerequisite: Movie): MoviePrerequisite => ({
      movieId: movie.id,
      prerequisiteId: prerequisite.id,
      movie,
      prerequisite,
    });

    const root = makeMovie('root');
    const branchA = makeMovie('branch-a');
    const branchB = makeMovie('branch-b');
    const foundation = makeMovie('foundation');
    root.prerequisiteLinks = [link(root, branchA), link(root, branchB)];
    branchA.prerequisiteLinks = [link(branchA, foundation)];
    branchB.prerequisiteLinks = [link(branchB, foundation)];

    moviesRepository.findOne
      .mockResolvedValueOnce(root)
      .mockResolvedValueOnce(branchA)
      .mockResolvedValueOnce(foundation)
      .mockResolvedValueOnce(branchB);

    const chain = await service.getTheMOvieChain(root.id);

    expect(chain.map((movie) => movie.id)).toEqual([
      foundation.id,
      branchA.id,
      branchB.id,
    ]);
  });
});
