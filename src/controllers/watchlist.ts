import { Request, Response } from "express";
import { RatingModel } from "../models/rating";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import {
  serializeRating,
  serializeRatings,
  serializeWatchlist,
  serializeWatchlistItem,
} from "../utils/serializers";
import { WatchlistItemModel } from "../models/watchlistItem";

interface AuthenticatedRequest extends Request {
  userId: number;
}

export const watchlistController = {
  async getWatchlist(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { page, limit } = parsePaginationParams(req.query);
    const result = await WatchlistItemModel.findAllByUserId(1, {
      page,
      limit,
    });
    const serializedWatchlist = serializeWatchlist(result.rows);

    const pagination = createPaginationMetadata(page, limit, result.count);

    res.json({
      data: serializedWatchlist,
      pagination,
    });
  },

  async createWatchlistItem(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { body } = req;

    try {
      const watchlistItem = await WatchlistItemModel.create({
        userId: authReq.userId,
        movieId: body.movieId,
        watched: body.watched,
      });
      res.location(`/watchlist/${authReq.userId}`);
      res.status(201).json(serializeWatchlistItem(watchlistItem));
    } catch {
      res.status(400).json({ error: "Bad Request" });
    }
  },
};
