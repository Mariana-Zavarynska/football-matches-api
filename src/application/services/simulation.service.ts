import { v4 as uuidv4 } from 'uuid';
import { Simulation } from '../../domain/entities/simulation';
import { SimulationStatus } from '../../domain/enums/simulationStatus';
import { SimulationRepository } from '../ports/simulation.repository';
import { EventPublisher } from '../ports/eventPublisher';
import { Clock } from '../ports/clock';
import {
    DEFAULT_MATCHES,
    SCORE_INTERVAL_MS,
    SIMULATION_DURATION_SECONDS,
    START_COOLDOWN_MS
} from '../../shared/constants/simulation';

export class SimulationService {
    private readonly timers = new Map<string, NodeJS.Timeout>();
    private lastGlobalStartAt: number | null = null;

    constructor(
        private readonly repository: SimulationRepository,
        private readonly publisher: EventPublisher,
        private readonly clock: Clock
    ) {}

    async start(name: string): Promise<Simulation> {
        const now = this.clock.now();

        if (
            this.lastGlobalStartAt !== null &&
            now - this.lastGlobalStartAt < START_COOLDOWN_MS
        ) {
            throw new Error('Simulation cannot be started more frequently than once per 5 seconds');
        }

        const simulation = Simulation.create(uuidv4(), name, [...DEFAULT_MATCHES]);
        simulation.start(now);

        await this.repository.save(simulation);
        this.lastGlobalStartAt = now;

        this.publisher.publish('simulation_started', this.toDto(simulation));
        this.runSimulation(simulation.id);

        return simulation;
    }

    async finish(id: string): Promise<Simulation> {
        const simulation = await this.requireSimulation(id);

        if (simulation.status !== SimulationStatus.RUNNING) {
            throw new Error('Only running simulation can be finished');
        }

        this.stopTimer(id);
        simulation.finish(this.clock.now());

        await this.repository.save(simulation);
        this.publisher.publish('simulation_finished', this.toDto(simulation));

        return simulation;
    }

    async restart(id: string): Promise<Simulation> {
        const simulation = await this.requireSimulation(id);

        if (simulation.status !== SimulationStatus.FINISHED) {
            throw new Error('Only finished simulation can be restarted');
        }

        const now = this.clock.now();
        simulation.restart(now);

        await this.repository.save(simulation);
        this.publisher.publish('simulation_restarted', this.toDto(simulation));

        this.runSimulation(simulation.id);

        return simulation;
    }

    async getById(id: string): Promise<Simulation> {
        return this.requireSimulation(id);
    }

    async getAll(): Promise<Simulation[]> {
        return this.repository.getAll();
    }

    private async requireSimulation(id: string): Promise<Simulation> {
        const simulation = await this.repository.getById(id);

        if (!simulation) {
            throw new Error('Simulation not found');
        }

        return simulation;
    }

    private runSimulation(id: string): void {
        const timer = this.clock.setInterval(async () => {
            const simulation = await this.repository.getById(id);

            if (!simulation || simulation.status !== SimulationStatus.RUNNING) {
                return;
            }

            this.applyRandomGoal(simulation);
            simulation.incrementTick();

            await this.repository.save(simulation);
            this.publisher.publish('score_updated', this.toDto(simulation));

            if (simulation.elapsedTicks >= SIMULATION_DURATION_SECONDS) {
                this.stopTimer(id);
                simulation.finish(this.clock.now());
                await this.repository.save(simulation);
                this.publisher.publish('simulation_finished', this.toDto(simulation));
            }
        }, SCORE_INTERVAL_MS);

        this.timers.set(id, timer);
    }

    private stopTimer(id: string): void {
        const timer = this.timers.get(id);

        if (timer) {
            this.clock.clearInterval(timer);
            this.timers.delete(id);
        }
    }

    private applyRandomGoal(simulation: Simulation): void {
        const candidates = simulation.matches.flatMap((_, matchIndex) => [
            { matchIndex, side: 'home' as const },
            { matchIndex, side: 'away' as const }
        ]);

        const selected = candidates[Math.floor(Math.random() * candidates.length)];
        const match = simulation.matches[selected.matchIndex];

        if (selected.side === 'home') {
            match.score.home += 1;
        } else {
            match.score.away += 1;
        }
    }

    private toDto(simulation: Simulation) {
        return {
            id: simulation.id,
            name: simulation.name,
            status: simulation.status,
            startedAt: simulation.startedAt,
            finishedAt: simulation.finishedAt,
            elapsedTicks: simulation.elapsedTicks,
            matches: simulation.matches
        };
    }
}
