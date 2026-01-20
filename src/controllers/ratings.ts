import { NextFunction, Request, Response } from "express";
import { RatingModel } from "../models/rating";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import { serializeRating, serializeRatings } from "../utils/serializers";
import { AppError } from "../middlewares/errorHandler";

interface AuthenticatedRequest extends Request {
  userId: number;
}

export const ratingsController = {
  async getAllRatings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId, 10);

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const { page, limit } = parsePaginationParams(req.query);
      const result = await RatingModel.findAllByMovieId(movieId, {
        page,
        limit,
      });
      const serializedRatings = serializeRatings(result.rows);
      const pagination = createPaginationMetadata(page, limit, result.count);

      res.status(200).json({ data: serializedRatings, pagination });
    } catch (err) {
      next(err);
    }
  },

  async getRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId, 10);
      const ratingId = parseInt(req.params.ratingId, 10);

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      if (isNaN(ratingId)) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
      if (!rating) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json(serializeRating(rating));
    } catch (err) {
      next(err);
    }
  },

  async createRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId, 10);
      const userId = (req as AuthenticatedRequest).userId;

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      // comprobar si ya ha valorado
      const existingRating = await RatingModel.findByUserAndMovie(
        userId,
        movieId,
      );
      if (existingRating) {
        const error: AppError = new Error("User has already rated this movie");
        error.statusCode = 409;
        throw error;
      }

      const { rating, comment } = req.body;
      const newRating = await RatingModel.create({
        movieId,
        userId,
        rating,
        comment: comment || null,
      });

      res.setHeader("Location", `/movies/${movieId}/ratings/${newRating.id}`);
      res.status(201).json(serializeRating(newRating));
    } catch (err) {
      next(err);
    }
  },

  async updateRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId, 10);
      const ratingId = parseInt(req.params.ratingId, 10);
      const userId = (req as AuthenticatedRequest).userId;

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      if (isNaN(ratingId)) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
      if (!rating) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      if (rating.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      const updateData: { rating?: number; comment?: string | null } = {};
      if (req.body.rating !== undefined) updateData.rating = req.body.rating;
      if (req.body.comment !== undefined) updateData.comment = req.body.comment;

      await RatingModel.update(ratingId, updateData);

      const updatedRating = await RatingModel.findById(ratingId);
      res.status(200).json(serializeRating(updatedRating!));
    } catch (err) {
      next(err);
    }
  },

  async deleteRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId, 10);
      const ratingId = parseInt(req.params.ratingId, 10);
      const userId = (req as AuthenticatedRequest).userId;

      if (isNaN(movieId)) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      if (isNaN(ratingId)) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
      if (!rating) {
        const error: AppError = new Error("Rating not found");
        error.statusCode = 404;
        throw error;
      }

      if (rating.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      await RatingModel.delete(ratingId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
