import { Atom, Calc, Listener, IReporter, IProgressable, Reporter, ISobokuArray, State, IStateHolder, IUnListener } from "../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "./reporter";
import * as u from "./util";

export type Depends = { readonly depends: SobokuReporterClass<any>[] };


class StateClass<T> extends SobokuReporterClass<T> implements IProgressable<T> {

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

class StateHolderClass<T> implements IStateHolder<T> {

    constructor(private readonly state: T) {}

    public s() {
        return this.state;
    }
    
}

class GateClass<T> extends SobokuReporterClass<T> {

    constructor(private readonly gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>) {
        super();
        reporter.report(this.listener, this);
    }

    private listener(val: T): void {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    }
    
}

export function reporter<T>(): Reporter<T> {
    return new SobokuReporterClass();
}

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function gate<T>(gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>): IReporter<T> {
    return new GateClass(gatekeeper, reporter);
}

export function convAtomToStateHolder<T>(atom: Atom<T>): IStateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
