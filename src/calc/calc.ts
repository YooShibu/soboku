import { Atom, IStateHolder } from "../../index.d";
import { convAtomToStateHolder } from "../soboku";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";


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

export abstract class CalcClass<T> extends SobokuReporterClass<T> {
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

export abstract class CalcFuncClass<T> extends CalcClass<T> {
    private readonly func: (args: any[]) => T;
    private readonly states: IStateHolder<any>[];

    constructor(atoms: Atom<any>[], func: (...args: any[]) => T) {
        super(atoms);
        this.func = u.optimizeCB(func);
        this.states = u.map(atoms, convAtomToStateHolder);
    }

    public s(): T {
        const args = u.map(this.states, getState);
        return this.func(args);
    }

}
