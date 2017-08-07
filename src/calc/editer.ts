import { Atom, Calc, IStateHolder } from "../../index.d";
import { convAtomToStateHolder } from "../state/state";
import { SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";
import { CalcClass, getState } from "./calc";


export class EditerClass<T> extends CalcClass<T> {
    private readonly func: (args: any[]) => T;
    private readonly states: IStateHolder<any>[];

    constructor(func: (...args: any[]) => T, atoms: Atom<any>[]) {
        super();
        this.func = u.optimizeCB(func);
        this.states = u.map(atoms, convAtomToStateHolder);
        super.addDepends(atoms, new SobokuListenerClass(this.listener, this));
    }

    public s(): T {
        const args = u.map(this.states, getState);
        return this.func(args);
    }

}

export function editer<T>(func: (...args: any[]) => T, atoms: Atom<any>[]): Calc<T> {
    return new EditerClass(func, atoms);
}