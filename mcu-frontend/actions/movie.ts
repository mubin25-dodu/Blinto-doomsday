"use server";
import { api } from "@/common/api/api";
import { MovieListResponse } from "@/common/interfaces/movie";

export async function getMovies() {
    const response = await api.get<MovieListResponse>("/movies");
    return response.data;
}
export async function markMovieAsWatched(movieId: string , watched: boolean) {
    const response = await api.patch(`/movies/${movieId}`, {
      watched: !watched,
    });
    console.log("Response from markMovieAsWatched:", response.data); // Log the response for debugging
    return response.data;
}