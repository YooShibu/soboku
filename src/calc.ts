import { Soboku, State, Calc, CalcProp, Listener, SobokuProp } from "../index.d";
import { assignSobokuProp } from "./soboku";
import { getState } from "./state";
import { emitListeners, on } from "./event";
import { optimizeCB, omit, has, unique, identity, isCalc } from "./util";

export function getDepends(sobokus: Soboku<any>[]): Soboku<any>[] {
    let result: Soboku<any>[] = [];
    for (let i = 0; sobokus.length > i; ++i) {
        const soboku = sobokus[i];
        if (isCalc(soboku))
            result = result.concat(soboku._depends);
        else
            result.push(soboku);
    }
    return unique(result);
}

export function dependency<T>(func: (...args: any[]) => T, ...sobokus: Soboku<any>[]): Calc<T> {
    const _func = optimizeCB(func);
    const soboku = assignSobokuProp<T, CalcProp<T>>({
        _getter: () => _func(sobokus.map(getState)),
        _depends: getDepends(sobokus)
    });
    addCalcEmitterToDepends(soboku);
    return soboku;
}

export function combine<T>(sobokuObj: { [K in keyof T]: Soboku<T[K]>}): Calc<T> {
    const soboku = assignSobokuProp<T, CalcProp<T>>({
        _getter: () => combineSoboku<T>(sobokuObj),
        _depends: getDepends(Object.keys(sobokuObj).map(k => sobokuObj[k]))
    });
    addCalcEmitterToDepends(soboku);
    return soboku;
}

export function mirror<T>(state: State<T>): Calc<T> {
    return dependency(identity, state);
}

export function combineSoboku<T>(source: { [K in keyof T]: Soboku<T[K]>}): T {
    const result: Partial<T> = {};
    for (let key in source)
        result[key] = getState(source[key]);
    return result as T;
}

export function addCalcEmitterToDepends<T>(calc: Calc<T>): void {
    const depends = calc._depends;
    const listeners = calc._listeners;
    const getter = calc._getter;
    const listener = () => emitListeners(calc, getter());
    for (let i = 0; depends.length > i; ++i)
        on(depends[i], listener);
}
