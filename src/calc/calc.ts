import { Atom, IStateHolder } from "../../index.d";
import { convAtomToStateHolder } from "../state/state";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";

export type Depends = { readonly depends: SobokuReporterClass<any>[] };

export function getDeps(atoms: Atom<any>[]): SobokuReporterClass<any>[] {
    let result: SobokuReporterClass<any>[] = [];
    for (let i = 0; atoms.length > i; ++i) {
        const atom = atoms[i];
        if(u.isDepends(atom)) {
            result = result.concat(atom.depends);
        } else if (u.isSobokuReporter(atom)) {
            result.push(atom);
        }
    }
    return u.unique(result);
}

export function getState<T>(sh: IStateHolder<T>): T {
    return sh.s();
}

export abstract class CalcClass<T> extends SobokuReporterClass<T> implements IStateHolder<T> {
    private readonly depends: SobokuReporterClass<any>[];

    constructor(atoms: Atom<any>[]) {
        super();
        const depends = this.depends = getDeps(atoms);
        const listener = this.listener;
        for (let i = 0; depends.length > i; ++i) {
            depends[i].report(listener, this);
        }
    }

    public abstract s(): T;
    
    public listener(val: T): void {
        this.next(this.s());
    };
    
}
