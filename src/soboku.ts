import { Atom, Calc, Listener, IReporter, Progressable, Reporter, SobokuArray, SobokuListener, State, StateHolder, UnListener } from "../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "./reporter";
import * as u from "./util";

export type Depends = { readonly depends: SobokuReporterClass<any>[] };


class StateClass<T> extends SobokuReporterClass<T> implements Progressable<T> {

    constructor(private state: T) {
        super();
    }

    public next(val: T): T {
        this.state = val;
        return super.next(val);
    }

    public s() {
        return this.state;
    }
    
}

class StateHolderClass<T> implements StateHolder<T> {

    constructor(private readonly state: T) {}

    public s() {
        return this.state;
    }
    
}

class GateClass<T> extends SobokuReporterClass<T> {

    constructor(private readonly gatekeeper: StateHolder<boolean>, reporter: IReporter<T>) {
        super();
        reporter.report(new SobokuListenerClass(this.listener, this));
    }

    private listener(val: T): void {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    }
    
}

class SobokuArrayClass<T> extends Array<T> implements SobokuArray<T> {
    public readonly r = new SobokuReporterClass<T[]>();
        
    public s(): T[] {
        return this;
    }

    public pop(): T | undefined {
        const result = super.pop();
        this.r.next(this);
        return result;
    }

    public push(): number {
        const i = super.push.apply(this, arguments);
        this.r.next(this);
        return i;
    }

    public reverse(): this {
        super.reverse();
        this.r.next(this);
        return this;
    }

    public shift(): T | undefined {
        const result = super.shift();
        this.r.next(this);
        return result;
    }

    public sort(compareFn?: (a: T, b: T) => number): this {
        super.sort(compareFn);
        this.r.next(this);
        return this;
    }
    
    public splice(): this {
        super.splice.apply(this, arguments);
        this.r.next(this);
        return this;
    }

    public unshift(): number {
        const result = super.unshift.apply(this, arguments);
        this.r.next(this);
        return result;
    }

}

export function reporter<T>(): Reporter<T> {
    return new SobokuReporterClass();
}

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function gate<T>(gatekeeper: StateHolder<boolean>, reporter: IReporter<T>): IReporter<T> {
    return new GateClass(gatekeeper, reporter);
}

export function sarray<T>(array?: T[]): SobokuArray<T> {
    if (array == undefined)
        return new SobokuArrayClass<T>();
    return new SobokuArrayClass<T>().concat(array) as SobokuArray<T>;
}

export function convAtomToStateHolder<T>(atom: Atom<T>): StateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
