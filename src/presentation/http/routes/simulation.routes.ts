import { Router } from 'express';
import { startSimulationSchema } from '../../../application/validators/simulation.schema';
import { validate } from '../middleware/validate';
import { SimulationController } from '../controllers/types';

export const createSimulationRoutes = (
    controller: SimulationController
): Router => {
    const router = Router();

    router.post('/start', validate(startSimulationSchema), controller.start);
    router.post('/:id/finish', controller.finish);
    router.post('/:id/restart', controller.restart);
    router.get('/:id', controller.getById);
    router.get('/', controller.getAll);

    return router;
};
