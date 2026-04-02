import { Clock } from '../../src/application/ports/clock';

type Timer = {
    id: number;
    callback: () => void;
    time: number;
    interval?: number;
    cleared: boolean;
};

export class FakeClock implements Clock {
    private currentTime = 0;
    private timers: Timer[] = [];
    private nextId = 1;

    now(): number {
        return this.currentTime;
    }

    setInterval(callback: () => void, ms: number): NodeJS.Timeout {
        const timer: Timer = {
            id: this.nextId++,
            callback,
            time: this.currentTime + ms,
            interval: ms,
            cleared: false
        };

        this.timers.push(timer);
        return timer as unknown as NodeJS.Timeout;
    }

    clearInterval(timer: NodeJS.Timeout): void {
        (timer as unknown as Timer).cleared = true;
    }

    async advanceBy(ms: number): Promise<void> {
        const target = this.currentTime + ms;

        while (true) {
            const next = this.timers
                .filter((timer) => !timer.cleared && timer.time <= target)
                .sort((a, b) => a.time - b.time)[0];

            if (!next) {
                break;
            }

            this.currentTime = next.time;
            next.callback();

            if (next.interval && !next.cleared) {
                next.time += next.interval;
            } else {
                next.cleared = true;
            }

            await Promise.resolve();
        }

        this.currentTime = target;
    }
}
