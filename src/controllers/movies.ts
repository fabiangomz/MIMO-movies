import { NextFunction, Request, Response } from "express";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import {
  serializeMovieWithRating,
  serializeMoviesWithRating,
} from "../utils/serializers";

import { AppError } from "../middlewares/errorHandler";

export const moviesController = {
  async getAllMovies(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit } = parsePaginationParams(req.query);
      const result = await MovieModel.findAllWithRating({ page, limit });
      const serializedMovies = serializeMoviesWithRating(result.rows);
      const pagination = createPaginationMetadata(page, limit, result.count);
      res.status(200).json({ data: serializedMovies, pagination });
    } catch (err) {
      next(err);
    }
  },

  async getMovie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = Number(req.params.id);

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findByIdWithRating(movieId);

      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      res.json(serializeMovieWithRating(movie));
    } catch (err) {
      next(err);
    }
  },
};
