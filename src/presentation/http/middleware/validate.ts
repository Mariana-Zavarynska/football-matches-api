import { AnyObjectSchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: AnyObjectSchema) =>
        async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
            try {
                req.body = await schema.validate(req.body, {
                    abortEarly: false,
                    stripUnknown: true
                });

                next();
            } catch (error) {
                next(error);
            }
        };
