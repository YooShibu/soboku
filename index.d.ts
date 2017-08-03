export type Listener<T> = (val: T) => void;
export interface SobokuListener<T> {
    emit(val: T): void;
}
export interface UnListener {
    unlisten(): void;
}
export interface SobokuEvents<T> {
    report(listener: Listener<T> | SobokuListener<T>): UnListener;
    listenerCount(): number;
}

export interface Progressable<T> {
    next(val: T): T;
}

export interface StateHolder<T> {
    s(): T;
}

export type Gate<T> = SobokuEvents<T> & Progressable<T>;
export type State<T> = SobokuEvents<T> & Progressable<T> & StateHolder<T>;
export type Calc<T> = SobokuEvents<T> & StateHolder<T>;
export type Atom<T> = T | Calc<T>;

export function gate<T>(): Gate<T>;
export function state<T>(initial: T): State<T>;
export function combine<T>(source: { [K in keyof T]: Atom<T[K]>}): Calc<T>;
export function listener<T>(func: Listener<T>): SobokuListener<T>;
export function dependency<R, A1>(func: (arg1: A1) => R, a1: Atom<A1>): Calc<R>;
export function dependency<R, A1, A2>(func: (arg1: A1, arg2: A2) => R, a1: Atom<A1>, a2: Atom<A2>): Calc<R>;
export function dependency<R, A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<R>;
export function dependency<R, A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<R>;
export function dependency<R>(func: (...args: any[]) => R, ...states: Atom<any>[]): Calc<R>
export function trigger<A1>(func: (arg1: A1) => boolean, a1: Atom<A1>): Calc<boolean>;
export function trigger<A1, A2>(func: (arg1: A1, arg2: A2) => boolean, a1: Atom<A1>, a2: Atom<A2>): Calc<boolean>;
export function trigger<A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<boolean>;
export function trigger<A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<boolean>;
export function trigger(func: (...args: any[]) => boolean, ...states: Atom<any>[]): Calc<boolean>


export interface Observable<I extends SobokuEvents<any>, O> {
    readonly error: SobokuEvents<Error>;
    readonly output: SobokuEvents<O>;
    readonly input: I;
}
export class UnhandledObservableError extends Error {
    constructor(err: Error)
}

export function interval(ms: Atom<number>): Observable<State<boolean>, number>;
export function timeout(ms: Atom<number>): Observable<State<boolean>, number>;