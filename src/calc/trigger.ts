import { Atom, Calc, StateHolder } from "../../index.d";
import * as u from "../util";
import { CalcFuncClass, getState } from "./calc";


class TriggerClass extends CalcFuncClass<boolean> {

    constructor(atoms: Atom<any>[], func: (...args: any[]) => boolean) {
        super(atoms, func);
    }

    public listener() {
        const s = this.s();
        if (s)
            this.next(s);
    }

}

export function trigger(func: (...args: any[]) => boolean, ...atoms: Atom<any>[]): Calc<boolean> {
    return new TriggerClass(atoms, func);
}