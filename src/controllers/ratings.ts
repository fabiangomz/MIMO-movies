import { Request, Response } from "express";
import { RatingModel } from "../models/rating";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import { serializeRating, serializeRatings } from "../utils/serializers";

interface AuthenticatedRequest extends Request {
  userId: number;
}

export const ratingsController = {
  async getAllRatings(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.movieId, 10);

    if (isNaN(movieId)) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const { page, limit } = parsePaginationParams(req.query);
    const result = await RatingModel.findAllByMovieId(movieId, { page, limit });
    const serializedRatings = serializeRatings(result.rows);
    const pagination = createPaginationMetadata(page, limit, result.count);

    res.status(200).json({ data: serializedRatings, pagination });
  },

  async getRating(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.movieId, 10);
    const ratingId = parseInt(req.params.ratingId, 10);

    if (isNaN(movieId)) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    if (isNaN(ratingId)) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
    if (!rating) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    res.status(200).json(serializeRating(rating));
  },

  async createRating(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.movieId, 10);
    const userId = (req as AuthenticatedRequest).userId;

    if (isNaN(movieId)) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    // comprobar si ya ha valorado
    const existingRating = await RatingModel.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingRating) {
      res.status(409).json({ error: "User has already rated this movie" });
      return;
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
  },

  async updateRating(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.movieId, 10);
    const ratingId = parseInt(req.params.ratingId, 10);
    const userId = (req as AuthenticatedRequest).userId;

    if (isNaN(movieId)) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    if (isNaN(ratingId)) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
    if (!rating) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    if (rating.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updateData: { rating?: number; comment?: string | null } = {};
    if (req.body.rating !== undefined) updateData.rating = req.body.rating;
    if (req.body.comment !== undefined) updateData.comment = req.body.comment;

    await RatingModel.update(ratingId, updateData);

    const updatedRating = await RatingModel.findById(ratingId);
    res.status(200).json(serializeRating(updatedRating!));
  },

  async deleteRating(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.movieId, 10);
    const ratingId = parseInt(req.params.ratingId, 10);
    const userId = (req as AuthenticatedRequest).userId;

    if (isNaN(movieId)) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    if (isNaN(ratingId)) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const rating = await RatingModel.findByIdAndMovieId(ratingId, movieId);
    if (!rating) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    if (rating.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await RatingModel.delete(ratingId);
    res.status(204).send();
  },
};
