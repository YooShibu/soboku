import { SobokuProp, Calc, Soboku, Listener } from "../index.d";
import { getState } from "./state";
import { on, emitListeners } from "./event";


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

export function omit<T>(obj: T, key: keyof T): T {
    const result = {} as T;
    for (let _key in obj)
        if (_key !== key)
            result[_key] = obj[_key];
    return result;
}

export function has(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function unique<T>(arr: T[]): T[] {
    const result: T[] = [];
    for (let i = 0; arr.length > i; ++i) {
        const val = arr[i];
        if (result.indexOf(val) === -1) {
            result.push(val);
        }
    }
    return result;
}

export function identity<T>(x: T): T {
    return x;
}

export function isCalc<T>(x: Soboku<T>): x is Calc<T> {
    return has(x, "_depends") && has(x, "_getter");
}

export function isSoboku(x: any): x is SobokuProp<any> {
    return typeof x === "object" && has(x, "__soboku__");
}
