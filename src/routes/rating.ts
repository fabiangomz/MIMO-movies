import express from "express";
import { ratingsController } from "../controllers/ratings";
import { validatePayload } from "../middlewares/validatePayload";
import { verifyToken } from "../middlewares/verifyApiKey";
import { createRatingSchema, updateRatingSchema } from "../schemas/rating";

const router = express.Router({ mergeParams: true });

/*
GET /movies/:movieId/ratings - Listar valoraciones de una película
POST /movies/:movieId/ratings - Crear valoración (autenticado)
GET /movies/:movieId/ratings/:ratingId - Obtener valoración específica
PATCH /movies/:movieId/ratings/:ratingId - Modificar valoración (solo autor)
DELETE /movies/:movieId/ratings/:ratingId - Eliminar valoración (solo autor)
*/
router.get("/", ratingsController.getAllRatings);
router.get("/:ratingId", ratingsController.getRating);

router.post(
  "/",
  verifyToken,
  validatePayload(createRatingSchema),
  ratingsController.createRating,
);

router.patch(
  "/:ratingId",
  verifyToken,
  validatePayload(updateRatingSchema),
  ratingsController.updateRating,
);

router.delete("/:ratingId", verifyToken, ratingsController.deleteRating);

export { router as ratingRoutes };
