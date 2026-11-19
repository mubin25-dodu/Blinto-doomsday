import dataSource from '../data-source.js';
import { Movie } from '../../movies/entities/movie.entity.js';
import { MoviePrerequisite } from '../../movies/entities/movie-prerequisite.entity.js';
import { In } from 'typeorm';

type MovieSeed = {
  id: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  prerequisites?: string[];
};

const movies: MovieSeed[] = [
  ['Iron Man', 2008, 126],
  ['The Incredible Hulk', 2008, 112],
  ['Iron Man 2', 2010, 124, ['Iron Man']],
  ['Thor', 2011, 114],
  ['Captain America: The First Avenger', 2011, 124],
  ['The Avengers', 2012, 143, ['Iron Man', 'Iron Man 2', 'Thor', 'Captain America: The First Avenger']],
  ['Iron Man 3', 2013, 130, ['Iron Man 2']],
  ['Thor: The Dark World', 2013, 112, ['Thor', 'The Avengers']],
  ['Captain America: The Winter Soldier', 2014, 136, ['Captain America: The First Avenger', 'The Avengers']],
  ['Guardians of the Galaxy', 2014, 121],
  ['Avengers: Age of Ultron', 2015, 141, ['The Avengers']],
  ['Ant-Man', 2015, 117, ['The Avengers']],
  ['Captain America: Civil War', 2016, 147, ['The Avengers', 'Captain America: The Winter Soldier']],
  ['Doctor Strange', 2016, 115],
  ['Guardians of the Galaxy Vol. 2', 2017, 136, ['Guardians of the Galaxy']],
  ['Spider-Man: Homecoming', 2017, 133, ['Captain America: Civil War']],
  ['Thor: Ragnarok', 2017, 130, ['Thor', 'Avengers: Age of Ultron']],
  ['Black Panther', 2018, 134, ['Captain America: Civil War']],
  ['Avengers: Infinity War', 2018, 149, ['Captain America: Civil War', 'Doctor Strange', 'Guardians of the Galaxy Vol. 2', 'Thor: Ragnarok', 'Black Panther']],
  ['Ant-Man and the Wasp', 2018, 118, ['Ant-Man', 'Captain America: Civil War']],
  ['Captain Marvel', 2019, 123],
  ['Avengers: Endgame', 2019, 181, ['Avengers: Infinity War', 'Ant-Man and the Wasp', 'Captain Marvel']],
  ['Spider-Man: Far From Home', 2019, 129, ['Spider-Man: Homecoming', 'Avengers: Endgame']],
  ['Black Widow', 2021, 134, ['Captain America: Civil War']],
  ['Shang-Chi and the Legend of the Ten Rings', 2021, 132],
  ['Eternals', 2021, 156],
  ['Spider-Man: No Way Home', 2021, 148, ['Spider-Man: Homecoming', 'Spider-Man: Far From Home', 'Doctor Strange']],
  ['Doctor Strange in the Multiverse of Madness', 2022, 126, ['Doctor Strange', 'Spider-Man: No Way Home', 'Avengers: Endgame']],
  ['Thor: Love and Thunder', 2022, 119, ['Thor: Ragnarok', 'Avengers: Endgame', 'Guardians of the Galaxy Vol. 2']],
  ['Black Panther: Wakanda Forever', 2022, 161, ['Black Panther', 'Avengers: Endgame']],
  ['Ant-Man and the Wasp: Quantumania', 2023, 124, ['Ant-Man and the Wasp', 'Avengers: Endgame']],
  ['Guardians of the Galaxy Vol. 3', 2023, 150, ['Guardians of the Galaxy Vol. 2', 'Avengers: Infinity War']],
  ['The Marvels', 2023, 105, ['Captain Marvel', 'Avengers: Endgame']],
  ['Deadpool & Wolverine', 2024, 128],
  ['Captain America: Brave New World', 2025, 118, ['Captain America: The Winter Soldier', 'Captain America: Civil War']],
  ['Thunderbolts*', 2025, 127, ['Black Widow', 'Captain America: Brave New World']],
  ['The Fantastic Four: First Steps', 2025, 114],
].map(([title, releaseYear, runtimeMinutes, prerequisites = []], index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  title: title as string,
  releaseYear: releaseYear as number,
  runtimeMinutes: runtimeMinutes as number,
  prerequisites: prerequisites as string[],
}));

async function seed(): Promise<void> {
  await dataSource.initialize();
  try {
    await dataSource.transaction(async (manager) => {
      const movieRepository = manager.getRepository(Movie);
      const linkRepository = manager.getRepository(MoviePrerequisite);
      await movieRepository.upsert(
        movies.map(({ prerequisites: _prerequisites, ...movie }) => movie),
        ['title'],
      );

      const persistedMovies = await movieRepository.findBy({
        title: In(movies.map((movie) => movie.title)),
      });
      const moviesByTitle = new Map(persistedMovies.map((movie) => [movie.title, movie]));

      await linkRepository.createQueryBuilder().delete().execute();

      const links = movies.flatMap((movie) =>
        (movie.prerequisites ?? []).map((title) => {
          const prerequisite = moviesByTitle.get(title);
          if (!prerequisite) throw new Error(`Unknown prerequisite: ${title}`);
          const currentMovie = moviesByTitle.get(movie.title);
          if (!currentMovie) throw new Error(`Unknown movie: ${movie.title}`);
          return { movieId: currentMovie.id, prerequisiteId: prerequisite.id };
        }),
      );
      if (links.length > 0) await linkRepository.insert(links);
    });
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
