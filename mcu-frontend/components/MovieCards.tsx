"use client";
import { markMovieAsWatched } from "@/actions/movie";
import type { Movie } from "@/common/interfaces/movie";
import { useState } from "react";
import Toast from "./toast";
import Link from "next/dist/client/link";

export default function MovieCards({
  initialMovies,
}: {
  initialMovies: Movie[];
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const markAsWatched = async (movieId: string, watched: boolean) => {
    try {
      await markMovieAsWatched(movieId, watched);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, watched: !watched } : movie,
        ),
      );
    } catch {
      setErrorMessage("Failed to update watched status");
    }
  };

  return (
    <>
      {errorMessage && (
        <Toast
          message={errorMessage}
          duration={4000}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie: Movie) => (
          <li
            key={movie.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-300">
                Release Year: {movie.releaseYear}
              </p>
              <p className="text-sm text-gray-300">
                Runtime: {movie.runtimeMinutes} minutes
              </p>
              <p className="text-sm text-gray-300">
                Watched: {movie.watched ? "Yes" : "No"}{" "}
                {movie.watched == false ? (
                  <button
                    onClick={() => markAsWatched(movie.id, movie.watched)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Mark as Watched
                  </button>
                ) : (
                  <button
                    onClick={() => markAsWatched(movie.id, movie.watched)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Mark as Not Watched
                  </button>
                )}
              </p>
            </div>
            <span className="flex flex-row h-fit w-fit gap-2">
              <Link
                href={`/movie/${movie.id}`}
                className="mt-3 px-2 py-0.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </Link>
              <Link
                href={`/movies/${movie.id}`}
                className="mt-3 px-2 py-0.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
