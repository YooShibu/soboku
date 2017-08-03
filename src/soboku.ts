import { Atom, Calc, Gate, State, StateHolder } from "../index.d";
import { SobokuEventsClass } from "./events";
import * as u from "./util";

export type Depends = { readonly depends: SobokuEventsClass<any>[] };


class GateClass<T> extends SobokuEventsClass<T> {

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


export function gate<T>(): Gate<T> {
    return new GateClass();
}

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function convAtomToStateHolder<T>(atom: Atom<T>): StateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
