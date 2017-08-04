import { SObservable, Atom, Reporter, State, StateHolder } from "../../index.d";
import { convAtomToStateHolder, reporter, state } from "../soboku";
import { SobokuListenerClass } from "../reporter";
import * as u from "../util";


abstract class TimerObservable implements SObservable<boolean, number> {
    public readonly input = reporter<boolean>();
    public readonly output = reporter<number>();
    protected readonly cb = () => this.output.next(Date.now());
    protected readonly ms: StateHolder<number>;
    protected timer: NodeJS.Timer;
    protected isEmitting = false;

    constructor(ms: Atom<number>) {
        const _ms = this.ms = convAtomToStateHolder(ms);
        this.input.report(new SobokuListenerClass(this.fireTimer, this));
        if (u.isSobokuEvent(_ms))
            _ms.report(new SobokuListenerClass(this.msChanged, this));
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


export function interval(ms: Atom<number>): SObservable<boolean, number> {
    return new IntervalObservable(ms);
}

export function timeout(ms: Atom<number>): SObservable<boolean, number> {
    return new TimeoutObservable(ms);
}
