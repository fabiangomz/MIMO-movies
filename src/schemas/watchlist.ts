import Joi from "joi";

export const createWatchlistItemSchema = Joi.object({
  movieId: Joi.number().integer().positive().required(),
  watched: Joi.boolean().optional().default(false),
});

export const updateWatchlistItemSchema = Joi.object({
  watched: Joi.boolean().required(),
});
