import { Atom, Calc, Reporter, State, StateHolder, IReporter } from "../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "./events";
import * as u from "./util";

export type Depends = { readonly depends: SobokuReporterClass<any>[] };


class ReporterClass<T> extends SobokuReporterClass<T> {

    public next(val: T) {
        return this.tellNews(val);
    }
    
}

class StateClass<T> extends SobokuReporterClass<T> {

    constructor(private state: T) {
        super();
    }

    public next(val: T): T {
        this.state = val;
        return this.tellNews(val);
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
        if (this.gatekeeper.s())
            this.tellNews(val);
    }
    
}

export function reporter<T>(): Reporter<T> {
    return new ReporterClass();
}

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function gate<T>(gatekeeper: StateHolder<boolean>, reporter: IReporter<T>): IReporter<T> {
    return new GateClass(gatekeeper, reporter);
}

export function convAtomToStateHolder<T>(atom: Atom<T>): StateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
