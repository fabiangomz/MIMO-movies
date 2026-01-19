import Joi from "joi";

export const createRatingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).multiple(0.5).required(),
  comment: Joi.string().max(500).allow(null, "").optional(),
});

export const updateRatingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).multiple(0.5).optional(),
  comment: Joi.string().max(500).allow(null, "").optional(),
}).min(1);
