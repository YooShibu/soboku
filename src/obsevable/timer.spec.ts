import { interval, timeout } from "./timer";
import { Atom, Reporter, SObservable, State } from "../../index.d";
import { trigger } from "../calc/trigger";
import { state } from "../soboku";

class Counter<T extends number | State<number>> {
    private readonly count = state(0);
    public readonly isEnd = trigger(c => c === this.times, this.count);
    public readonly ms: T;
    public readonly timer: SObservable<boolean, number>;
    private readonly times: number;

    constructor(ms: T, times: number, timer: (ms: Atom<number>) => SObservable<boolean, number>) {
        this.ms = ms;
        this.times = times;
        this.timer = timer(ms);
        this.timer.output.report(this.inc, this);
        this.isEnd.report(this.end, this);
    }

    private inc() {
        const count = this.count;
        count.next(count.s() + 1);
    }

    private end() {
        this.timer.input.next(false);
    }
}


describe("timer", () => {
    let now: number;
    beforeEach(() => {
        now = Date.now();
    });
        
    describe("interval", () => {
        it("should start interval when input.next gets true", done => {
            const { isEnd, timer } = new Counter(20, 3, interval);
            isEnd.report(() => {
                expect(Date.now() - now).toBeGreaterThanOrEqual(20 * 3);
                done();
            });

            timer.input.next(true);
        });
        it("should not restart interval if already emitting", done => {
            const { isEnd, timer } = new Counter(20, 3, interval);
            isEnd.report(() => {
                expect(Date.now() - now).toBeGreaterThanOrEqual(20 * 3);
                done();
            });

            timer.input.next(true);
            timer.input.next(true);
        });
        it("should restart timer if ms was changed", done => {
            const c = new Counter(state(20), 3, interval);
            c.isEnd.report(() => {
                expect(Date.now() - now).toBeGreaterThanOrEqual(20 * 2 + 40);
                done();
            });
            c.ms.next(2);
            c.ms.next(20);
            setTimeout(() => c.ms.next(40), 42);

            c.timer.input.next(true);
        });
    });

    describe("timeout", () => {
        it("should start timeout when input.next gets true", done => {
            const { isEnd, timer } = new Counter(20, 1, timeout);
            isEnd.report(() => {
                expect(Date.now() - now).toBeGreaterThanOrEqual(20);
                done();
            });
            timer.input.next(true);
        });
        it("should restart timeout wihle emitting and input.next gets true", done => {
            const { isEnd, timer } = new Counter(40, 1, timeout);
            isEnd.report(() => {
                expect(Date.now() - now).toBeGreaterThanOrEqual(50);
                done();
            });
            setTimeout(() => timer.input.next(true), 20);
            timer.input.next(true);
        });
    });
    
});