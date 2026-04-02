import { Simulation } from '../../domain/entities/simulation';

export interface SimulationRepository {
    save(simulation: Simulation): Promise<void>;
    getById(id: string): Promise<Simulation | null>;
    getAll(): Promise<Simulation[]>;
}
