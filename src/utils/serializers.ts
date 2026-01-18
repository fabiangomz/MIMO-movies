import { Movie } from "../db";

export interface SerializedMovie {
  id: number;
  title: string;
  genre: string;
  duration: number;
}

export function serializeMovie(movie: Movie): SerializedMovie {
  return {
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
  };
}

export const serializeMovies = (movies: Movie[]): SerializedMovie[] => {
  return movies.map(serializeMovie);
};
