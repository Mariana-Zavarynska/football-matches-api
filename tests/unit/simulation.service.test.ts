import { SimulationService } from '../../src/application/services/simulation.service';
import { InMemorySimulationRepository } from '../../src/infrastructure/repositories/inMemorySimulation.repository';
import { FakeClock } from './FakeClock';

class FakePublisher {
    public events: Array<{ event: string; payload: unknown }> = [];

    publish(event: string, payload: unknown): void {
        this.events.push({ event, payload });
    }
}

const getTotalGoals = (sim: any) =>
    sim.matches.reduce(
        (sum: number, m: any) => sum + m.score.home + m.score.away,
        0
    );

describe('SimulationService', () => {
    let repository: InMemorySimulationRepository;
    let publisher: FakePublisher;
    let clock: FakeClock;
    let service: SimulationService;

    beforeEach(() => {
        repository = new InMemorySimulationRepository();
        publisher = new FakePublisher();
        clock = new FakeClock();
        service = new SimulationService(repository, publisher, clock);
    });

    it('should start simulation successfully', async () => {
        const simulation = await service.start('Katar 2023');

        expect(simulation.name).toBe('Katar 2023');
        expect(simulation.status).toBe('RUNNING');
        expect(simulation.matches).toHaveLength(3);

        expect(publisher.events).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ event: 'simulation_started' })
            ])
        );
    });

    it('should not allow starting more often than once per 5 seconds', async () => {
        await service.start('Katar 2023');

        await expect(service.start('Qatar 2024')).rejects.toThrow(
            'Simulation cannot be started more frequently than once per 5 seconds'
        );
    });

    it('should score exactly one goal per second', async () => {
        const simulation = await service.start('Katar 2023');

        await clock.advanceBy(3000);

        const updated = await service.getById(simulation.id);

        expect(updated.elapsedTicks).toBe(3);
        expect(getTotalGoals(updated)).toBe(3);
    });

    it('should publish goal events every second', async () => {
        await service.start('Katar 2023');

        await clock.advanceBy(3000);

        const goalEvents = publisher.events.filter(
            (e) => e.event === 'score_updated'
        );

        expect(goalEvents.length).toBe(3);
    });

    it('should finish automatically after 9 seconds with total 9 goals', async () => {
        const simulation = await service.start('Katar 2023');

        await clock.advanceBy(9000);

        const finished = await service.getById(simulation.id);

        expect(finished.status).toBe('FINISHED');
        expect(finished.elapsedTicks).toBe(9);
        expect(getTotalGoals(finished)).toBe(9);

        const finishedEvent = publisher.events.find(
            (e) => e.event === 'simulation_finished'
        );

        expect(finishedEvent).toBeDefined();
    });

    it('should allow manual finish before 9 seconds', async () => {
        const simulation = await service.start('Katar 2023');

        await clock.advanceBy(3000);
        await service.finish(simulation.id);

        const finished = await service.getById(simulation.id);

        expect(finished.status).toBe('FINISHED');
        expect(finished.elapsedTicks).toBe(3);
    });

    it('should restart finished simulation and reset scores', async () => {
        const simulation = await service.start('Katar 2023');

        await clock.advanceBy(9000);
        const restarted = await service.restart(simulation.id);

        expect(restarted.status).toBe('RUNNING');
        expect(restarted.elapsedTicks).toBe(0);
        expect(getTotalGoals(restarted)).toBe(0);
    });

    it('should not restart simulation if it is not finished', async () => {
        const simulation = await service.start('Katar 2023');

        await expect(service.restart(simulation.id)).rejects.toThrow();
    });
});
