"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeClock = void 0;
class FakeClock {
    currentTime = 0;
    timers = [];
    nextId = 1;
    now() {
        return this.currentTime;
    }
    setInterval(callback, ms) {
        const timer = {
            id: this.nextId++,
            callback,
            time: this.currentTime + ms,
            interval: ms,
            cleared: false
        };
        this.timers.push(timer);
        return timer;
    }
    clearInterval(timer) {
        timer.cleared = true;
    }
    async advanceBy(ms) {
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
            }
            else {
                next.cleared = true;
            }
            await Promise.resolve();
        }
        this.currentTime = target;
    }
}
exports.FakeClock = FakeClock;
