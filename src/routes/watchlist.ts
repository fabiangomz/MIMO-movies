/* GET /watchlist/:userId - Obtener watchlist (solo propietario)
POST /watchlist/:userId/items - Añadir película al watchlist (solo propietario)
PATCH /watchlist/:userId/items/:itemId - Actualizar item (solo propietario)
DELETE /watchlist/:userId/items/:itemId - Eliminar item (solo propietario) */

import express from "express";
import { validatePayload } from "../middlewares/validatePayload";
import { verifyToken } from "../middlewares/verifyApiKey";
import {
  createWatchlistItemSchema,
  updateWatchlistItemSchema,
} from "../schemas/watchlist";
import { watchlistController } from "../controllers/watchlist";

const router = express.Router();

// GET /watchlist/:userId - Obtener watchlist (autenticado, solo propietario)
router.get("/:userId", verifyToken, watchlistController.getWatchlist);

// POST /watchlist/:userId/items - Añadir película al watchlist (autenticado, solo propietario)
router.post(
  "/:userId/items",
  verifyToken,
  validatePayload(createWatchlistItemSchema),
  watchlistController.createWatchlistItem,
);

// PATCH /watchlist/:userId/items/:itemId - Actualizar item (autenticado, solo propietario)
router.patch(
  "/:userId/items/:itemId",
  verifyToken,
  validatePayload(updateWatchlistItemSchema),
  watchlistController.updateWatchlistItem,
);

// DELETE /watchlist/:userId/items/:itemId - Eliminar item (autenticado, solo propietario)
router.delete(
  "/:userId/items/:itemId",
  verifyToken,
  watchlistController.deleteWatchlistItem,
);

export { router as watchListRoutes };
