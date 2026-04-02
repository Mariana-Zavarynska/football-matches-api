import { RequestHandler } from 'express';

export type SimulationController = {
    start: RequestHandler;
    finish: RequestHandler;
    restart: RequestHandler;
    getById: RequestHandler;
    getAll: RequestHandler;
};
