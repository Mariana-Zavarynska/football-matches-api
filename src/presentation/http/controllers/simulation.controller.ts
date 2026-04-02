import { Request, Response, NextFunction } from 'express';
import { SimulationService } from '../../../application/services/simulation.service';
import { SimulationController } from './types';


export const createSimulationController = (
    simulationService: SimulationService
): SimulationController => {
    const start = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const simulation = await simulationService.start(req.body.name);
            res.status(201).json(simulation);
        } catch (error) {
            next(error);
        }
    };

    const finish = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id as string;
            const simulation = await simulationService.finish(id);
            res.status(200).json(simulation);
        } catch (error) {
            next(error);
        }
    };

    const restart = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id as string;
            const simulation = await simulationService.restart(id);
            res.status(200).json(simulation);
        } catch (error) {
            next(error);
        }
    };

    const getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params.id as string;
            const simulation = await simulationService.getById(id);
            res.status(200).json(simulation);
        } catch (error) {
            next(error);
        }
    };

    const getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const simulations = await simulationService.getAll();
            res.status(200).json(simulations);
        } catch (error) {
            next(error);
        }
    };

    return {
        start,
        finish,
        restart,
        getById,
        getAll,
    };
};
