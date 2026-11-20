"use client";

import { getMoviesByID, getWatchOrder } from "@/actions/movie";
import type { Movie } from "@/common/interfaces/movie";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function MovieDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [chain, setChain] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getMoviesByID(id), getWatchOrder(id)])
      .then(([movieData, prerequisiteChain]) => {
        if (!active) return;
        setMovie(movieData);
        setChain(prerequisiteChain);
      })
      .catch((requestError) => {
        console.error("Failed to load watch list:", requestError);
        if (active) setError("Failed to load the watch list.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const watchList = useMemo(
    () => (movie ? [...chain, movie] : chain),
    [chain, movie],
  );
  const watchedCount = watchList.filter((item) => item.watched).length;

  if (loading) {
    return <main className="p-6 text-slate-300">Loading watch list...</main>;
  }

  if (error || !movie) {
    return <main className="p-6 text-red-400">{error || "Movie not found."}</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6 text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-sky-400">Watch list</p>
          <h1 className="mt-1 text-3xl font-bold text-white">{movie.title}</h1>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-right">
          <p className="text-2xl font-bold text-sky-400">
            {watchedCount}/{watchList.length}
          </p>
          <p className="text-xs text-slate-400">watched</p>
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-slate-700 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-white">Watch chain</h2>

        {watchList.length === 1 ? (
          <p className="mt-4 text-slate-400">This movie has no prerequisite movies.</p>
        ) : (
          <ol className="mt-5 space-y-3">
            {watchList.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  item.watched
                    ? "border-emerald-800/60 bg-emerald-950/30"
                    : "border-slate-700 bg-slate-800/60"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">
                    {item.releaseYear} · {item.runtimeMinutes} minutes
                  </p>
                </div>
                <span className={item.watched ? "text-emerald-400" : "text-slate-400"}>
                  {item.watched ? "Seen" : "Not seen"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default function MovieDetailsPage() {
  return (
    <Suspense fallback={<main className="p-6 text-slate-300">Loading watch list...</main>}>
      <MovieDetailsContent />
    </Suspense>
  );
}
