import { Atom, IProgressable, State, IStateHolder } from "../../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";


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

export function state<T>(initial: T): State<T> {
    return new StateClass(initial);
}

export function convAtomToStateHolder<T>(atom: Atom<T>): IStateHolder<T> {
    if (u.isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}
