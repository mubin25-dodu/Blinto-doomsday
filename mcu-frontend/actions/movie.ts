"use server";
import { api } from "@/common/api/api";
import {
  CreateMovieRequest,
  Movie,
  MovieListResponse,
  UpdateMovieRequest,
  WatchOrderResponse,
} from "@/common/interfaces/movie";
import axios from "axios";

export async function getMovies() {
  const response = await api.get<MovieListResponse>("/movies");
  
  return response.data.sort((a, b) => a.releaseYear - b.releaseYear);
}
export async function getMoviesByID(id:string) {
  const response = await api.get<Movie>(`/movies/${id}`);
  console.log(response.data)
  return response.data;
}

export async function getWatchOrder(id: string) {
  const response = await api.get<WatchOrderResponse>(`/movies/${id}/watchorder`);
  return response.data.sort((a, b) => a.releaseYear - b.releaseYear);
}

export async function createMovie(movie: CreateMovieRequest) {
  const response = await api.post<Movie>("/movies", movie);
  return response.data;
}

export async function updateMovie(id: string, movie: UpdateMovieRequest) {
  const response = await api.patch<Movie>(`/movies/${id}`, movie);
  return response.data;
}

export async function markMovieAsWatched(movieId: string, watched: boolean) {
  const response = await api.patch(`/movies/${movieId}`, {
    watched: !watched,
  });

  return response.data;
}
// check - circular - dependency;

export async function circularDependencyCheck(movieId: string, prerequisites: string) {
  try {
    const response = await api.get(
      `/movies/check-circular-dependency/${movieId}/${prerequisites}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { statusCode: error.response?.status ?? null };
    }

    throw error;
  }
}
