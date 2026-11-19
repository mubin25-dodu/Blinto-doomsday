import { Suspense } from "react";
import Link from "next/link";
import { getMovies } from "@/actions/movie";
import MovieCards from "@/components/MovieCards";

async function MoviesContent() {
  const movies = await getMovies();
  return <MovieCards initialMovies={movies} />;
}

export default function Home() {
  return (
    <>
      <span className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold mb-5">Your Listed Marvel Movies</h1>
        <Link href="/add-movie" className="text-black hover:scale-98 bg-amber-50 px-4 py-2 rounded-lg shadow-md">
          Add Movies
        </Link>
      </span>
      <Suspense fallback={<p>Loading movies...</p>}>
        <MoviesContent />
      </Suspense>
    </>
  );
}
