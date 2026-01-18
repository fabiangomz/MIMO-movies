import { Request, Response } from "express";
import { MovieModel } from "../models/movie";
import {
  createPaginationMetadata,
  parsePaginationParams,
} from "../utils/pagination";
import { serializeMovie, serializeMovies } from "../utils/serializers";

export const moviesController = {
  async getAllMovies(req: Request, res: Response): Promise<void> {
    const { page, limit } = parsePaginationParams(req.query);

    const result = await MovieModel.findAll({ page, limit });
    const serializedMovies = serializeMovies(result.rows);
    const pagination = createPaginationMetadata(page, limit, result.count);
    res.status(200).json({ data: serializedMovies, pagination });
  },

  async getMovie(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.id, 10);
    const movie = await MovieModel.findById(movieId);
    if (movie) {
      res.status(200).json(movie);
      return;
    }

    res.status(404).json({ error: "Movie not found" });
  },
};
