import { Atom, Calc, StateHolder } from "../../index.d";
import * as u from "../util";
import { CalcFuncClass, getState } from "./calc";


class DependencyClass<T> extends CalcFuncClass<T> {

    constructor(atoms: Atom<any>[], func: (...args: any[]) => T) {
        super(atoms, func);
    }

}

export function dependency<T>(func: (...args: any[]) => T, ...atoms: Atom<any>[]): Calc<T> {
    return new DependencyClass(atoms, func);
}