import { NextFunction, Request, Response } from "express";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import {
  serializeWatchlist,
  serializeWatchlistItem,
} from "../utils/serializers";
import { WatchlistItemModel } from "../models/watchlistItem";
import { UserModel } from "../models/user";
import { AppError } from "../middlewares/errorHandler";

interface AuthenticatedRequest extends Request {
  userId: number;
}

export const watchlistController = {
  async getWatchlist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      if (authReq.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      const { page, limit } = parsePaginationParams(req.query);
      const result = await WatchlistItemModel.findAllByUserId(userId, {
        page,
        limit,
      });
      const serializedWatchlist = serializeWatchlist(result.rows);
      const pagination = createPaginationMetadata(page, limit, result.count);

      res.status(200).json({ data: serializedWatchlist, pagination });
    } catch (err) {
      next(err);
    }
  },

  async createWatchlistItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      if (authReq.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      const { movieId, watched } = req.body;

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        const error: AppError = new Error("Movie not found");
        error.statusCode = 404;
        throw error;
      }

      const existingItem = await WatchlistItemModel.findByUserAndMovie(
        userId,
        movieId,
      );
      if (existingItem) {
        const error: AppError = new Error("Movie already in watchlist");
        error.statusCode = 409;
        throw error;
      }

      const watchlistItem = await WatchlistItemModel.create({
        userId,
        movieId,
        watched: watched ?? false,
      });

      res.setHeader(
        "Location",
        `/watchlist/${userId}/items/${watchlistItem.id}`,
      );
      res.status(201).json(
        serializeWatchlistItem({
          ...watchlistItem.get({ plain: true }),
          title: movie.title,
        }),
      );
    } catch (err) {
      next(err);
    }
  },

  async updateWatchlistItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = parseInt(req.params.userId, 10);
      const itemId = parseInt(req.params.itemId, 10);

      if (isNaN(userId)) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      if (isNaN(itemId)) {
        const error: AppError = new Error("Watchlist item not found");
        error.statusCode = 404;
        throw error;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      if (authReq.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      const item = await WatchlistItemModel.findByIdAndUserId(itemId, userId);
      if (!item) {
        const error: AppError = new Error("Watchlist item not found");
        error.statusCode = 404;
        throw error;
      }

      const { watched } = req.body;

      await WatchlistItemModel.update(itemId, { watched });

      const updatedItems = await WatchlistItemModel.findAllByUserId(userId);
      const updatedItem = updatedItems.rows.find((i) => i.id === itemId);

      if (updatedItem) {
        res.status(200).json(serializeWatchlistItem(updatedItem));
      } else {
        res.status(200).json({
          id: itemId,
          movieId: item.movieId,
          title: "",
          watched,
          createdAt: item.createdAt,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  async deleteWatchlistItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = parseInt(req.params.userId, 10);
      const itemId = parseInt(req.params.itemId, 10);

      if (isNaN(userId)) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      if (isNaN(itemId)) {
        const error: AppError = new Error("Watchlist item not found");
        error.statusCode = 404;
        throw error;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        const error: AppError = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      if (authReq.userId !== userId) {
        const error: AppError = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      const item = await WatchlistItemModel.findByIdAndUserId(itemId, userId);
      if (!item) {
        const error: AppError = new Error("Watchlist item not found");
        error.statusCode = 404;
        throw error;
      }

      await WatchlistItemModel.delete(itemId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
