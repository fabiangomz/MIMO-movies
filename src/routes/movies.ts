import express from "express";
import { moviesController } from "../controllers/movies";
import { validatePayload } from "../middlewares/validatePayload";

const router = express.Router();

router.get("/", moviesController.getAllMovies);
router.get("/:id", moviesController.getMovie);

export { router as movieRoutes };
