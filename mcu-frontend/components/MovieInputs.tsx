"use client";
import { useEffect, useState } from "react";
import { getMovies } from "@/actions/movie";
import { Movie } from "@/common/interfaces/movie";
import { circularDependencyCheck } from "@/actions/movie";

interface MovieInputsProps {
  id?: string;
  title?: string;
  releaseYear?: number | string;
  runtimeMinutes?: number | string;
  watched?: boolean;
  prerequisites?: string[];
}

export default function MovieInputs(params?: MovieInputsProps) {
  const [formdata, setFormData] = useState<{
    id: string;
    title: string;
    releaseYear: number | string;
    runtimeMinutes: number | string;
    watched: boolean;
    prerequisites: string[];
  }>({
    id: params?.id ?? "new",
    title: params?.title ?? "",
    releaseYear: params?.releaseYear ?? "",
    runtimeMinutes: params?.runtimeMinutes ?? "",
    watched: params?.watched ?? false,
    prerequisites: params?.prerequisites ?? [],
  });

  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState("");

  const filteredMovies = availableMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  useEffect(() => {
    getMovies()
      .then((data) => setAvailableMovies(data ?? []))
      .catch((err) => console.error("Failed to load movies:", err))
      .finally(() => setLoadingMovies(false));
  }, []);

  const togglePrerequisite = (movieId: string) => {
    setFormData((prev) => {
      const current = prev.prerequisites ?? [];
      const exists = current.includes(movieId);
      return {
        ...prev,
        prerequisites: exists
          ? current.filter((id) => id !== movieId)
          : [...current, movieId],
      };
    });
  };

  const formhandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = formdata.title.trim();
    const releaseYear = Number(formdata.releaseYear);
    const runtimeMinutes = Number(formdata.runtimeMinutes);

    if (!title) {
      setValidationError("Movie title is required.");
    } else if (!Number.isInteger(releaseYear) || releaseYear < 1888) {
      setValidationError("Enter a valid release year (1888 or later).");
    } else if (releaseYear > new Date().getFullYear() + 1) {
      setValidationError("Enter a valid release year (up to next year).");
    } else if (!Number.isInteger(runtimeMinutes) || runtimeMinutes <= 0) {
      setValidationError("Runtime must be a positive whole number of minutes.");
    } else {
      setValidationError("");
      // Submit logic here
    }
  };

  const circulerChecck = (movieId: string, prerequisite: string) => {
    const response = circularDependencyCheck(movieId, prerequisite);
    console.log("Response from circulerChecck:", response); // Log the response for debugging
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-slate-100">
      <h1 className="mb-6 text-2xl font-bold text-white">Add a New Movie</h1>
      <form
        className="flex w-full max-w-4xl flex-col gap-6 rounded-lg border border-slate-700 bg-slate-900/60 p-6 shadow-xl"
        onSubmit={formhandle}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Side: Inputs */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-sky-400">
              Movie Details
            </h2>

            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="title"
              >
                Movie Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Movie Title"
                value={formdata.title}
                onChange={(e) =>
                  setFormData({ ...formdata, title: e.target.value })
                }
                className="mt-1 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="release-year"
              >
                Release Year
              </label>
              <input
                id="release-year"
                type="number"
                min="1888"
                step="1"
                placeholder="Release Year"
                value={formdata.releaseYear}
                onChange={(e) =>
                  setFormData({ ...formdata, releaseYear: e.target.value })
                }
                className="mt-1 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="runtime"
              >
                Runtime (minutes)
              </label>
              <input
                id="runtime"
                type="number"
                placeholder="Runtime (minutes)"
                value={formdata.runtimeMinutes}
                onChange={(e) =>
                  setFormData({ ...formdata, runtimeMinutes: e.target.value })
                }
                className="mt-1 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={formdata.watched}
                  onChange={(e) =>
                    setFormData({ ...formdata, watched: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-sky-500"
                />
                Watched
              </label>
              <p className="mt-1 text-xs text-slate-400">
                Check if you have already watched this movie
              </p>
            </div>

            {validationError && (
              <p role="alert" className="text-sm text-red-400">
                {validationError}
              </p>
            )}
          </div>

          {/* Right Side: Movies Checkboxes (Prerequisites) */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-sky-400">
              Prerequisites ({formdata.prerequisites?.length ?? 0} selected)
            </h2>
            <p className="text-xs text-slate-400">
              Select movies that must be watched prior to this one:
            </p>

            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
            />

            <div className="mt-1 max-h-72 flex-1 space-y-2 overflow-y-auto rounded border border-slate-700 bg-slate-800/60 p-3">
              {loadingMovies ? (
                <p className="text-sm text-slate-400">Loading movies...</p>
              ) : availableMovies.length === 0 ? (
                <p className="text-sm text-slate-400">No movies available.</p>
              ) : filteredMovies.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No movies match &quot;{searchQuery}&quot;
                </p>
              ) : (
                filteredMovies.map((movie) => {
                  const isChecked = Boolean(
                    formdata.prerequisites?.includes(movie.id),
                  );
                  return (
                    <label
                      key={movie.id}
                      className={`flex cursor-pointer items-center justify-between rounded p-2 text-sm transition-colors ${
                        isChecked
                          ? "bg-sky-950/60 text-sky-200 border border-sky-800/50"
                          : "hover:bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          onClick={() => {
                            formdata.id !== "new"
                              ? circulerChecck(formdata.id, movie.id)
                              : "";
                          }}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePrerequisite(movie.id)}
                          className="h-4 w-4 rounded accent-sky-500"
                        />
                        <span className="font-medium">{movie.title}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {movie.releaseYear}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 rounded bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}
