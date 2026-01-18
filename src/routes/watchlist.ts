/* GET /watchlist/:userId - Obtener watchlist (solo propietario)
POST /watchlist/:userId/items - Añadir película al watchlist (solo propietario)
PATCH /watchlist/:userId/items/:itemId - Actualizar item (solo propietario)
DELETE /watchlist/:userId/items/:itemId - Eliminar item (solo propietario) */

import express from "express";
import { ratingsController } from "../controllers/ratings";
import { validatePayload } from "../middlewares/validatePayload";
import { verifyToken } from "../middlewares/verifyApiKey";
import { createRatingSchema, updateRatingSchema } from "../schemas/rating";
import { watchlistController } from "../controllers/watchlist";

const router = express.Router({ mergeParams: true });

router.get("/:userId", watchlistController.getWatchlist);

router.post("/", verifyToken, validatePayload(createRatingSchema), () => {});

router.patch(
  "/:ratingId",
  verifyToken,
  validatePayload(updateRatingSchema),
  () => {},
);

router.delete("/:ratingId", verifyToken, () => {});

export { router as watchListRoutes };
