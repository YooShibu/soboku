export type Listener<T> = (val: T) => void;
export interface IUnsubscriber {
    unsubscribe(): void;
}
export interface IReporter<T> {
    report(listener: Listener<T>, thisArg?: any): IUnsubscriber;
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
export function state<T>(initial: T): State<T>;
export function sarray<T>(initial?: T[]): ISArray<T>;
export function combine<T>(source: { [K in keyof T]: Atom<T[K]>}): Calc<T>;
export function dependency<T, A1>(func: (arg1: A1) => T, a1: Atom<A1>): Calc<T>;
export function dependency<T, A1, A2>(func: (arg1: A1, arg2: A2) => T, a1: Atom<A1>, a2: Atom<A2>): Calc<T>;
export function dependency<T, A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => T, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<T>;
export function dependency<T, A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => T, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<T>;
export function dependency<T>(func: (...args: any[]) => T, ...states: Atom<any>[]): Calc<T>
export function publisher<T>(permition: Calc<boolean>, reporter: Calc<T>): Calc<T>;
export function trigger<A1>(func: (arg1: A1) => boolean, a1: Atom<A1>): Calc<boolean>;
export function trigger<A1, A2>(func: (arg1: A1, arg2: A2) => boolean, a1: Atom<A1>, a2: Atom<A2>): Calc<boolean>;
export function trigger<A1, A2, A3>(func: (arg1: A1, arg2: A2, arg3: A3) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>): Calc<boolean>;
export function trigger<A1, A2, A3, A4>(func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => boolean, a1: Atom<A1>, a2: Atom<A2>, a3: Atom<A3>, a4: Atom<A4>): Calc<boolean>;
export function trigger(func: (...args: any[]) => boolean, ...states: Atom<any>[]): Calc<boolean>

export interface ISObservable<I extends Reporter<any>, O> {
    readonly input: I;
    readonly output: IReporter<O>;
}

export function interval(ms: Atom<number>): ISObservable<State<boolean>, number>;
export function timeout(ms: Atom<number>): ISObservable<State<boolean>, number>;
export function sequenceEqual<T>(sequence: T[]  | ISArray<T>, compareFn?: (x: T, y: T) => boolean): ISObservable<Reporter<T>, true>;