export type SobokuProp<T> = {
    readonly _listeners:((state: T) => void)[];
    readonly __soboku__: true;
}

export type StateProp<T> = {
    _state: T;
}

export type State<T> = SobokuProp<T> & StateProp<T>;

export type CalcProp<T> = {
    readonly _getter: () => T;
    readonly _depends: Soboku<any>[]
}

export type Calc<T> = SobokuProp<T> & CalcProp<T>;

export type Soboku<T> = State<T> | Calc<T>;

export declare type Listener<T> = {
    (state: T): any;
}

export function state<T>(initial: T): State<T>;
export function on<T, L extends Listener<T>>(target: SobokuProp<T>, listener: L, emitFirstTime?: boolean): L;
export function removeListener<T>(target: SobokuProp<T>, listener: Listener<T>): void;
export function setState<T>(state: State<T>, currentState: T): T;
export function getState<T>(soboku: Soboku<T>): T;
export function combine<T>(source: { [K in keyof T]: Soboku<T[K]>}): Calc<T>;
export function dependency<R, S1>(func: (arg1: S1) => R, s1: Soboku<S1>): Calc<R>;
export function dependency<R, S1, S2>(func: (arg1: S1, arg2: S2) => R, s1: Soboku<S1>, s2: Soboku<S2>): Calc<R>;
export function dependency<R, S1, S2, S3>(func: (arg1: S1, arg2: S2, arg3: S3) => R, s1: Soboku<S1>, s2: Soboku<S2>, s3: Soboku<S3>): Calc<R>;
export function dependency<R, S1, S2, S3, S4>(func: (arg1: S1, arg2: S2, arg3: S3, arg4: S4) => R, s1: Soboku<S1>, s2: Soboku<S2>, s3: Soboku<S3>, s4: Soboku<S4>): Calc<R>;
export function dependency<R>(func: (...args: any[]) => R, ...states: Soboku<any>[]): Calc<R>
export function mirror<T>(state: State<T>): Calc<T>;
export function isSoboku(x: any): boolean;