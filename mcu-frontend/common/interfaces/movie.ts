export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  watched: boolean;
  prerequisiteLinks?: MoviePrerequisite[];
  dependentLinks?: MoviePrerequisite[];
  createdAt: string;
  updatedAt: string;
}

export interface MoviePrerequisite {
  movieId: string;
  prerequisiteId: string;
  movie?: Movie;
  prerequisite?: Movie;
}

export interface CreateMovieRequest {
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  prerequisites?: string[];
}

export type UpdateMovieRequest = Partial<CreateMovieRequest>;

export type MovieListResponse = Movie[];
export type WatchOrderResponse = Movie[];
export type CircularDependencyResponse = boolean;

