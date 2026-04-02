import express, { Express } from 'express';
import { createSimulationRoutes } from '../presentation/http/routes/simulation.routes';
import { errorHandler } from '../presentation/http/middleware/errorHandler';
import { SimulationController } from '../presentation/http/controllers/types';

export const createApp = (controller: SimulationController): Express => {
    const app = express();

    app.use(express.json());
    app.use('/api/simulations', createSimulationRoutes(controller));
    app.use(errorHandler);

    return app;
};
