export type Listener<T> = (val: T) => void;
export interface IUnsubscriber {
    unsubscribe(): void;
}
export interface IListener<T> {
    read(val: T): void;
}
export interface IReporter<T> {
    report(listener: Listener<T> | IListener<T>): IUnsubscriber;
    listenerCount(): number;
}

export interface IProgressable<T> {
    next(val: T): T;
}

export interface IStateHolder<T> {
    s(): T;
}

export interface ISArray<T> extends IReporter<T[]> {
    s(): T[];
    pop(): T | undefined;
    push(...items: T[]): number;
    reverse(): T[];
    shift(): T | undefined;
    sort(compareFn?: (a: T, b: T) => number): T[];
    splice(start: number, deleteCount?: number): T[];
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    unshift(...items: T[]): number;
}

export type Reporter<T> = IReporter<T> & IProgressable<T>;
export type State<T> = IReporter<T> & IProgressable<T> & IStateHolder<T>;
export type Calc<T> = IReporter<T> & IStateHolder<T>;
export type Atom<T> = T | Calc<T>;

export function reporter<T>(): Reporter<T>;
export function gate<T>(gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>): IReporter<T>;
export function listener<T>(func: Listener<T>, thisArg?: any): IListener<T>;
export function state<T>(initial: T): State<T>;
export function sarray<T>(initial?: T[]): ISArray<T>;
export function toStateHolder<T>(atom: Atom<T>): IStateHolder<T>;
export function combine<T>(source: { [K in keyof T]: Atom<T[K]>}): Calc<T>;
export function editer<T, A1>(func: (arg1: A1) => T, atoms: [Atom<A1>]): Calc<T>;
export function editer<T, A1, A2>(func: (arg1: A1, arg2: A2) => T, atoms: [Atom<A1>, Atom<A2>]): Calc<T>;
export function editer<T, A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => T, atoms: [Atom<A1>, Atom<A2>, Atom<A3>]): Calc<T>;
export function editer<T, A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => T, atoms: [Atom<A1>, Atom<A2>, Atom<A3>, Atom<A4>]): Calc<T>;
export function editer<T, A1, A2, A3, A4, A5>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => T, atoms: [Atom<A1>, Atom<A2>, Atom<A3>, Atom<A4>, Atom<A5>]): Calc<T>;
export function editer<T, A1, A2, A3, A4, A5, A6>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6) => T, atoms: [Atom<A1>, Atom<A2>, Atom<A3>, Atom<A4>, Atom<A5>, Atom<A6>]): Calc<T>;
export function editer<T, A1, A2, A3, A4, A5, A6, A7>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7) => T, atoms: [Atom<A1>, Atom<A2>, Atom<A3>, Atom<A4>, Atom<A5>, Atom<A6>, Atom<A7>]): Calc<T>;
export function publisher<T>(permition: Calc<boolean>, reporter: Calc<T>): Calc<T>;
export function trigger(condition: Calc<boolean>): Calc<boolean>;
export function ntrigger(condition: Calc<boolean>): Calc<boolean>;

export class ReporterClass<T> implements IReporter<T>, IProgressable<T> {
    public next(val: T): T;
    public listenerCount(): number;
    public report(listener: Listener<T> | IListener<T>): IUnsubscriber;
}