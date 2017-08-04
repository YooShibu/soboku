import { Atom, Calc, IStateHolder } from "../../index.d";
import { convAtomToStateHolder } from "../soboku";
import * as u from "../util";
import { CalcClass, getState } from "./calc";


class CombineClass<T> extends CalcClass<T> {
    private readonly shObj: { [K in keyof T]: IStateHolder<T[K]> };

    constructor(atomObj: { [K in keyof T]: Atom<T[K]>}) {
        const atoms: Atom<any>[] = [];
        for (let key in atomObj) {
            atoms.push(atomObj[key]);
        }
        super(atoms);
        this.shObj = u.mapObj(atomObj, convAtomToStateHolder);
    }

    public s() {
        return u.mapObj<{ [K in keyof T]: IStateHolder<T[K]> }, T>(this.shObj, getState);
    }
    
}

export function combine<T>(atomObj: { [K in keyof T]: Atom<T[K]>}): Calc<T> {
    return new CombineClass(atomObj);
}
