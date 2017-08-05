export type Listener<T> = (val: T) => void;
export interface IUnListener {
    unlisten(): void;
}
export interface IReporter<T> {
    report(listener: Listener<T>, thisArg?: any): IUnListener;
    listenerCount(): number;
}

export interface IProgressable<T> {
    next(val: T): T;
}

export interface IStateHolder<T> {
    s(): T;
}

export interface ISobokuArray<T> extends IReporter<T[]> {
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
export function state<T>(initial: T): State<T>;
export function combine<T>(source: { [K in keyof T]: Atom<T[K]>}): Calc<T>;
export function dependency<R, A1>(func: (arg1: A1) => R, a1: Atom<A1>): Calc<R>;
export function dependency<R, A1, A2>(func: (arg1: A1, arg2: A2) => R, a1: Atom<A1>, a2: Atom<A2>): Calc<R>;
export function dependency<R, A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<R>;
export function dependency<R, A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<R>;
export function dependency<R>(func: (...args: any[]) => R, ...states: Atom<any>[]): Calc<R>
export function publisher<T>(permition: IReporter<boolean>, reporter: IReporter<T>): Calc<T>;
export function trigger<A1>(func: (arg1: A1) => boolean, a1: Atom<A1>): Calc<true>;
export function trigger<A1, A2>(func: (arg1: A1, arg2: A2) => boolean, a1: Atom<A1>, a2: Atom<A2>): Calc<true>;
export function trigger<A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<true>;
export function trigger<A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<true>;
export function trigger(func: (...args: any[]) => boolean, ...states: Atom<any>[]): Calc<true>

export interface SObservable<I extends Reporter<any>, O> {
    readonly input: I;
    readonly output: IReporter<O>;
}

export function interval(ms: Atom<number>): SObservable<State<boolean>, number>;
export function timeout(ms: Atom<number>): SObservable<State<boolean>, number>;
export function sequenceEqual<T>(sequence: T[], compareFn?: (x: T, y: T) => boolean): SObservable<Reporter<T>, true>;