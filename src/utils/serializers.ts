import { Rating, WatchlistItem } from "../db";
import { MovieWithRating } from "../models/movie";
import { WatchlistItemWithMovie } from "../models/watchlistItem";

export interface SerializedMovieWithRating {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number | null;
}

export function serializeMovieWithRating(
  movie: MovieWithRating,
): SerializedMovieWithRating {
  return {
    id: movie.id!,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    rating: movie.rating,
  };
}

export function serializeMoviesWithRating(
  movies: MovieWithRating[],
): SerializedMovieWithRating[] {
  return movies.map(serializeMovieWithRating);
}

export interface SerializedRating {
  id: number;
  movieId: number;
  userId: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
}
export function serializeRating(rating: Rating): SerializedRating {
  return {
    id: rating.id,
    movieId: rating.movieId,
    userId: rating.userId,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.createdAt,
  };
}

export function serializeRatings(ratings: Rating[]): SerializedRating[] {
  return ratings.map(serializeRating);
}

export interface SerializedWatchlistItem {
  id: number;
  userId: number;
  movieId: number;
  watched: boolean;
  createdAt?: Date;
}

export function serializeWatchlistItem(
  watchlistItem: WatchlistItemWithMovie,
): SerializedWatchlistItem {
  return {
    id: watchlistItem.id!,
    userId: watchlistItem.userId,
    movieId: watchlistItem.movieId,
    watched: watchlistItem.watched,
    createdAt: watchlistItem.createdAt,
  };
}

export function serializeWatchlist(
  watchlist: WatchlistItemWithMovie[],
): SerializedWatchlistItem[] {
  return watchlist.map(serializeWatchlistItem);
}
