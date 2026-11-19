"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMovies, getMoviesByID } from "@/actions/movie";
import MovieInputs from "@/components/MovieInputs";
import { Movie, MovieListResponse } from "@/common/interfaces/movie";

function EditMovieContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [formData, setFormData] = useState<Movie>();

  useEffect(() => {
    let active = true;
    getMoviesByID(id).then((data) => {
      if (active && data) {
        setFormData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (!formData) {
    return <span>loading the page..</span>;
  }

  return (
    <MovieInputs
      id={id}
      title={formData.title}
      releaseYear={formData.releaseYear}
      runtimeMinutes={formData.runtimeMinutes}
      watched={formData.watched}
      prerequisites={
        formData.prerequisiteLinks?.map((p) => p.prerequisiteId) ?? []
      }
    />
  );
}

export default function MoviePage() {
  return (
    <Suspense fallback={<span>loading the page..</span>}>
      <EditMovieContent />
    </Suspense>
  );
}
