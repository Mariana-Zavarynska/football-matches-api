import { SimulationStatus } from '../enums/simulationStatus';
import { Match } from '../types/match';

export class Simulation {
    constructor(
        public readonly id: string,
        public name: string,
        public status: SimulationStatus,
        public matches: Match[],
        public startedAt: number | null,
        public finishedAt: number | null,
        public elapsedTicks: number
    ) {}

    static create(id: string, name: string, matches: Omit<Match, 'score'>[]): Simulation {
        return new Simulation(
            id,
            name,
            SimulationStatus.IDLE,
            matches.map((match) => ({
                ...match,
                score: { home: 0, away: 0 }
            })),
            null,
            null,
            0
        );
    }

    start(now: number): void {
        this.status = SimulationStatus.RUNNING;
        this.startedAt = now;
        this.finishedAt = null;
        this.elapsedTicks = 0;
    }

    finish(now: number): void {
        this.status = SimulationStatus.FINISHED;
        this.finishedAt = now;
    }

    restart(now: number): void {
        this.matches = this.matches.map((match) => ({
            ...match,
            score: { home: 0, away: 0 }
        }));
        this.status = SimulationStatus.RUNNING;
        this.startedAt = now;
        this.finishedAt = null;
        this.elapsedTicks = 0;
    }

    incrementTick(): void {
        this.elapsedTicks += 1;
    }
}
