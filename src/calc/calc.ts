import { Atom, IStateHolder } from "../../index.d";
import { toStateHolder } from "../state/state";
import { ReporterClass, ListenerClass } from "../reporter/reporter";
import * as u from "../util";

export type Depends = { readonly depends: ReporterClass<any>[] };

export function getDeps(atoms: Atom<any>[]): ReporterClass<any>[] {
    let result: ReporterClass<any>[] = [];
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

export abstract class CalcClass<T> extends ReporterClass<T> implements IStateHolder<T>, Depends {
    public readonly depends: ReporterClass<any>[] = [];

    public abstract s(): T;

    protected addDepends(atoms: Atom<any>[], listener: ListenerClass<any>) {
        const depends = getDeps(atoms);
        for (let i = 0; depends.length > i; ++i) {
            depends[i].report(listener);
        }
        this.depends.push.apply(this.depends, depends);
    }

    protected listener(val: T): void {
        this.next(this.s());
    };
    
}
