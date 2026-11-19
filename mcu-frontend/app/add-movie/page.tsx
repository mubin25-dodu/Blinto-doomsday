"use client";
import { useState } from "react";

export default function AddMoviePage() {
    /// not using any library for form handling, just using basic HTML form elements and state management 
    const [formdata, setFormData] = useState<{
        title: string;
        releaseYear: string;
        runtimeMinutes: string;
        watched: boolean;
    }>({
        title: '',
        releaseYear: '',
        runtimeMinutes: '',
        watched: false,
    });
      const [validationError, setValidationError] = useState('');

      const formhandle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const title = formdata.title.trim();
        const releaseYear = Number(formdata.releaseYear);
        const runtimeMinutes = Number(formdata.runtimeMinutes);

        if (!title) {
          setValidationError("Movie title is required.");
        } else if (!Number.isInteger(releaseYear) || releaseYear < 1888) {
          setValidationError("Enter a valid release year (1888 or later).");
        } else if (!Number.isInteger(releaseYear) || releaseYear > new Date().getFullYear() + 1) {
          setValidationError("Enter a valid release year (up to next year).");
        } else if (!Number.isInteger(runtimeMinutes) || runtimeMinutes <= 0) {
          setValidationError(
            "Runtime must be a positive whole number of minutes.",
          );
        } else {
          setValidationError("");
        }
    }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-slate-100">
      <h1 className="mb-5 text-2xl font-bold text-white">Add a New Movie</h1>
      <form
        className="flex w-full max-w-sm flex-col gap-3 rounded-lg border p-6 shadow-xl"
        onSubmit={formhandle}
      >
        <label className="block text-sm font-medium text-slate-200" htmlFor="title">
          Movie Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Movie Title"
          value={formdata.title}
          onChange={(e) => setFormData({ ...formdata, title: e.target.value })}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          required
        />

        <label className="block text-sm font-medium text-slate-200" htmlFor="release-year">
          Release Year
        </label>
        <input
          id="release-year"
          type="number"
          min="1888"
          step="1"
          placeholder="Release Year"
          value={formdata.releaseYear}
          onChange={(e) => setFormData({ ...formdata, releaseYear: e.target.value })}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          required
        />

        <label className="block text-sm font-medium text-slate-200" htmlFor="runtime">
          Runtime (minutes)
        </label>
        <input
          id="runtime"
          type="number"
          placeholder="Runtime (minutes)"
          value={formdata.runtimeMinutes}
          onChange={(e) => setFormData({ ...formdata, runtimeMinutes: e.target.value })}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          required
        />

        <label className="flex items-center gap-2 text-slate-200">
          <input
            type="checkbox"
            checked={formdata.watched}
            onChange={(e) => setFormData({ ...formdata, watched: e.target.checked })}
            className="h-4 w-4 accent-sky-500"
          />
          Watched
        </label>
        <span className="text-sm text-slate-400">
          Check if you have watched this movie
        </span>
        {validationError && (
          <p role="alert" className="text-sm text-red-400">
            {validationError}
          </p>
        )}
        <span className=" hidden text-sm text-slate-400">
          
        </span>
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}
