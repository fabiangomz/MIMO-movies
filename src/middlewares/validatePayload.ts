import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validatePayload =
    (schema: Joi.ObjectSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const data = req.body;
            const result = schema.validate(data);

            if (result.error) {
                res.status(422).json({ error: result.error.details });
                return;
            }

            next();
        };

