import { SObservable, Atom, Reporter, State, IStateHolder } from "../../index.d";
import { convAtomToStateHolder, state } from "../state/state";
import { SobokuListenerClass, SobokuReporterClass } from "../reporter/reporter";
import * as u from "../util";


abstract class TimerObservable implements SObservable<State<boolean>, number> {
    public readonly input = state(false);
    public readonly output = new SobokuReporterClass<number>();
    protected readonly cb = () => this.output.next(Date.now());
    protected readonly ms: IStateHolder<number>;
    protected timer: NodeJS.Timer;
    protected isEmitting = false;

    constructor(ms: Atom<number>) {
        const _ms = this.ms = convAtomToStateHolder(ms);
        this.input.report(this.fireTimer, this);
        if (u.isSobokuReporter(_ms))
            _ms.report(this.msChanged, this);
    }

    private msChanged(ms: number) {
        if (this.isEmitting) {
            this.fireTimer(false);
            this.fireTimer(true, ms);
        }
    }

    private fireTimer(trigger: boolean, ms?: number): void {
        this.fire(trigger, ms || this.ms.s());
        this.isEmitting = trigger;
    }

    protected abstract fire(trigger: boolean, ms: number): void;

}

class IntervalObservable extends TimerObservable {

    protected fire(trigger: boolean, ms: number) {
        if (trigger === false) {
            clearInterval(this.timer);
        } else if (this.isEmitting === false) {
            this.timer = setInterval(this.cb, ms);
        }
    }
    
}

class TimeoutObservable extends TimerObservable {

    protected fire(trigger: boolean, ms: number) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    }

}


export function interval(ms: Atom<number>): SObservable<State<boolean>, number> {
    return new IntervalObservable(ms);
}

export function timeout(ms: Atom<number>): SObservable<State<boolean>, number> {
    return new TimeoutObservable(ms);
}
