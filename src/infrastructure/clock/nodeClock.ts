import { Clock } from '../../application/ports/clock';

export class NodeClock implements Clock {
    now(): number {
        return Date.now();
    }

    setInterval(callback: () => void, ms: number): NodeJS.Timeout {
        return setInterval(callback, ms);
    }

    clearInterval(timer: NodeJS.Timeout): void {
        clearInterval(timer);
    }
}
