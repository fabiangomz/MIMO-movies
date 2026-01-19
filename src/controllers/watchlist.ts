import { Request, Response } from "express";
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

interface AuthenticatedRequest extends Request {
  userId: number;
}

export const watchlistController = {
  async getWatchlist(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (authReq.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const { page, limit } = parsePaginationParams(req.query);
    const result = await WatchlistItemModel.findAllByUserId(userId, {
      page,
      limit,
    });
    const serializedWatchlist = serializeWatchlist(result.rows);
    const pagination = createPaginationMetadata(page, limit, result.count);

    res.status(200).json({ data: serializedWatchlist, pagination });
  },

  async createWatchlistItem(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (authReq.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const { movieId, watched } = req.body;

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const existingItem = await WatchlistItemModel.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingItem) {
      res.status(409).json({ error: "Movie already in watchlist" });
      return;
    }

    const watchlistItem = await WatchlistItemModel.create({
      userId,
      movieId,
      watched: watched ?? false,
    });

    res.setHeader("Location", `/watchlist/${userId}/items/${watchlistItem.id}`);
    res.status(201).json(
      serializeWatchlistItem({
        ...watchlistItem.get({ plain: true }),
        title: movie.title,
      }),
    );
  },

  async updateWatchlistItem(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const userId = parseInt(req.params.userId, 10);
    const itemId = parseInt(req.params.itemId, 10);

    if (isNaN(userId)) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (isNaN(itemId)) {
      res.status(404).json({ error: "Watchlist item not found" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (authReq.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const item = await WatchlistItemModel.findByIdAndUserId(itemId, userId);
    if (!item) {
      res.status(404).json({ error: "Watchlist item not found" });
      return;
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
  },

  async deleteWatchlistItem(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const userId = parseInt(req.params.userId, 10);
    const itemId = parseInt(req.params.itemId, 10);

    if (isNaN(userId)) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (isNaN(itemId)) {
      res.status(404).json({ error: "Watchlist item not found" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (authReq.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const item = await WatchlistItemModel.findByIdAndUserId(itemId, userId);
    if (!item) {
      res.status(404).json({ error: "Watchlist item not found" });
      return;
    }

    await WatchlistItemModel.delete(itemId);
    res.status(204).send();
  },
};
