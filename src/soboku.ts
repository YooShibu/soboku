import { Atom, Calc, Stream, State, StateHolder, SobokuEvents } from "../index.d";
import { SobokuEventsClass, SobokuListenerClass } from "./events";
import * as u from "./util";

export type Depends = { readonly depends: SobokuEventsClass<any>[] };


class StreamClass<T> extends SobokuEventsClass<T> {

    public next(val: T) {
        return this.emitListener(val);
    }
    
}

class StateClass<T> extends SobokuEventsClass<T> {

    constructor(private state: T) {
        super();
    }

    public next(val: T): T {
        this.state = val;
        return this.emitListener(val);
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

class GateClass<T> extends SobokuEventsClass<T> {

    constructor(private readonly gatekeeper: StateHolder<boolean>, reporter: SobokuEvents<T>) {
        super();
        reporter.report(new SobokuListenerClass(this.listener, this));
    }

    private listener(val: T): void {
        if (this.gatekeeper.s())
            this.emitListener(val);
    }
    
}


export function stream<T>(): Stream<T> {
    return new StreamClass();
}

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function gate<T>(gatekeeper: StateHolder<boolean>, reporter: SobokuEvents<T>): SobokuEvents<T> {
    return new GateClass(gatekeeper, reporter);
}

export function convAtomToStateHolder<T>(atom: Atom<T>): StateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
