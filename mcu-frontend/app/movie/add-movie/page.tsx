import MovieInputs from "@/components/MovieInputs";

export default function AddMoviePage() {


  return (
    <>
      <MovieInputs
        id="new"
        title=""
        releaseYear=""
        runtimeMinutes=""
        watched={false}
        prerequisites={[]}
      />
    </>
  );
}
