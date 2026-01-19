import { Request, Response } from "express";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import {
  serializeMovieWithRating,
  serializeMoviesWithRating,
} from "../utils/serializers";

export const moviesController = {
  async getAllMovies(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePaginationParams(req.query);

    const result = await MovieModel.findAllWithRating({ page, limit });
    const serializedMovies = serializeMoviesWithRating(result.rows);
    const pagination = createPaginationMetadata(page, limit, result.count);
    res.status(200).json({ data: serializedMovies, pagination });
  },

  async getMovie(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.id, 10);

    if (isNaN(movieId)) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    const movie = await MovieModel.findByIdWithRating(movieId);
    if (movie) {
      res.status(200).json(serializeMovieWithRating(movie));
      return;
    }

    res.status(404).json({ message: "Movie not found" });
  },
};
