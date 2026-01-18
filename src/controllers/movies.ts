import { Request, Response } from "express";
import { MovieModel, MovieWithRating } from "../models/movie";
import { Movie } from "../db";

export const moviesController = {
  async getAllMovies(req: Request, res: Response): Promise<void> {
    const movies = await MovieModel.findAll();
    res.status(200).json(movies);
  },
  async getMovie(req: Request, res: Response): Promise<void> {
    const movieId = parseInt(req.params.id, 10);
    const movie = await MovieModel.findById(movieId);
    if (movie) {
      res.status(200).json(movie);
    }
  },
};
