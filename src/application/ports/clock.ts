export interface Clock {
    now(): number;
    setInterval(callback: () => void, ms: number): NodeJS.Timeout;
    clearInterval(timer: NodeJS.Timeout): void;
}
