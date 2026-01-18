import express from "express";
import { moviesController } from "../controllers/movies";
import { ratingRoutes } from "./rating";

const router = express.Router();

router.get("/", moviesController.getAllMovies);
router.get("/:id", moviesController.getMovie);

router.use("/:movieId/ratings", ratingRoutes);

export { router as movieRoutes };
