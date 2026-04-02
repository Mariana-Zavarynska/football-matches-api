import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';

export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.errors
        });
    }

    if (error instanceof Error) {
        if (error.message === 'Simulation not found') {
            return res.status(404).json({ message: error.message });
        }

        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
};
