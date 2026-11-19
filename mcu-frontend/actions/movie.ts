"use server";
import { api } from "@/common/api/api";
import { Movie, MovieListResponse } from "@/common/interfaces/movie";

export async function getMovies() {
  const response = await api.get<MovieListResponse>("/movies");
  return response.data;
}
export async function getMoviesByID(id:string) {
  const response = await api.get<Movie>(`/movies/${id}`);
  return response.data;
}
export async function markMovieAsWatched(movieId: string, watched: boolean) {
  const response = await api.patch(`/movies/${movieId}`, {
    watched: !watched,
  });
  console.log("Response from markMovieAsWatched:", response.data); // Log the response for debugging
  return response.data;
}
// check - circular - dependency;

export async function circularDependencyCheck(movieId: string, prerequisites: string) {
  const response = await api.get(
    `/check-circular-dependency/${movieId}/${prerequisites}`,
  );
  console.log("Response from circularDependencyCheck:", response.data); // Log the response for debugging
  return response.data;
}