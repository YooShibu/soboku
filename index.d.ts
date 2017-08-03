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

export type Stream<T> = SobokuEvents<T> & Progressable<T>;
export type State<T> = SobokuEvents<T> & Progressable<T> & StateHolder<T>;
export type Calc<T> = SobokuEvents<T> & StateHolder<T>;
export type Atom<T> = T | Calc<T>;

export function stream<T>(): Stream<T>;
export function state<T>(initial: T): State<T>;
export function combine<T>(source: { [K in keyof T]: Atom<T[K]>}): Calc<T>;
export function gate<T>(gatekeeper: StateHolder<boolean>, stream: SobokuEvents<T>): SobokuEvents<T>;
export function dependency<R, A1>(func: (arg1: A1) => R, a1: Atom<A1>): Calc<R>;
export function dependency<R, A1, A2>(func: (arg1: A1, arg2: A2) => R, a1: Atom<A1>, a2: Atom<A2>): Calc<R>;
export function dependency<R, A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<R>;
export function dependency<R, A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<R>;
export function dependency<R>(func: (...args: any[]) => R, ...states: Atom<any>[]): Calc<R>
export function trigger<A1>(func: (arg1: A1) => boolean, a1: Atom<A1>): Calc<true>;
export function trigger<A1, A2>(func: (arg1: A1, arg2: A2) => boolean, a1: Atom<A1>, a2: Atom<A2>): Calc<true>;
export function trigger<A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<true>;
export function trigger<A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<true>;
export function trigger(func: (...args: any[]) => boolean, ...states: Atom<any>[]): Calc<true>

export function listener<T>(func: Listener<T>): SobokuListener<T>;

export interface SObservable<I, O> {
    readonly input: Stream<I>;
    readonly output: SobokuEvents<O>;
}
export interface SObservableWithError<I, O> extends SObservable<I, O> {
    readonly error: SobokuEvents<Error>;
}
export class UnhandledSObservableError extends Error {
    constructor(err: Error)
}

export function interval(ms: Atom<number>): SObservable<boolean, number>;
export function timeout(ms: Atom<number>): SObservable<boolean, number>;
export function sequenceEqual<T>(sequence: T[], compare?: (x: T, y: T) => boolean): SObservable<T, true>;