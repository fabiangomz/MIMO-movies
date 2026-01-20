import express from "express";
import { respondTo } from "./middlewares/respondTo";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import { movieRoutes } from "./routes/movies";
import { watchListRoutes } from "./routes/watchlist";

export const app = express();

app.use(express.json());
app.use(respondTo("application/json"));
app.use("/movies", movieRoutes);
app.use("/watchlist", watchListRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
