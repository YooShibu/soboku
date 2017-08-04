import { IStateHolder } from "../index.d";
import { Depends } from "./soboku";
import { SobokuReporterClass, SobokuListenerClass } from "./reporter";


export function optimizeCB<T>(func: (...args: any[]) => T): (args: any[]) => T {
    switch (func.length) {
        case 1:
            return (args: any[]) => func(args[0])
        case 2:
            return (args: any[]) => func(args[0], args[1]);
        case 3:
            return (args: any[]) => func(args[0], args[1], args[2]);
        case 4:
            return (args: any[]) => func(args[0], args[1], args[2], args[3]);
        default:
            return (args: any[]) => func.apply(undefined, args);
    }
}

export function has(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function unique<T>(arr: T[]): T[] {
    const result: T[] = [];
    for (let i = 0; arr.length > i; ++i) {
        const val = arr[i];
        if (indexOf(result, val) === -1) {
            result.push(val);
        }
    }
    return result;
}

export function identity<T>(x: T): T {
    return x;
}

export function indexOf<T>(arr: T[], val: T): number {
    for (let i = 0; arr.length > i; ++i) {
        if (arr[i] === val) {
            return i;
        }
    }
    return -1;
}

export function spliceOne<T>(arr: T[], index: number): void {
    if (0 > index) {
        return;
    }
    for (let i = index, j = index + 1; arr.length > j; ++i, ++j) {
        arr[i] = arr[j];
    }
    arr.pop();
}

export function map<T, U>(arr: T[], iteratee: (val: T) => U): U[] {
    const result: U[] = [];
    for (let i = 0; arr.length > i; ++i) {
        result.push(iteratee(arr[i]));
    }
    return result;
}

export function mapObj<T extends { [key: string]: any }, U extends { [key: string]: any }>(obj: T, iteratee: <K1 extends keyof T, K2 extends keyof U>(val: T[K1]) => U[K2]): U {
    const result: { [key: string]: any } = {};
    for (let key in obj) {
        result[key] = iteratee(obj[key]);
    }
    return result as U;
}

export function isSobokuReporter(x: any): x is SobokuReporterClass<any> {
    return typeof x === "object" && x instanceof SobokuReporterClass;
}

export function isStateHolder(x: any): x is IStateHolder<any> {
    return typeof x === "object"  && typeof x.s === "function";
}

export function isDepends(x: any): x is Depends {
    return isSobokuReporter(x) && has(x, "depends");
}
