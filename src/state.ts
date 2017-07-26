import { Soboku, State, StateProp, Calc } from "../index.d";
import { assignSobokuProp } from "./soboku";
import { emitListeners } from "./event";
import { has, isCalc } from "./util";


export function state<T> (initial: T): State<T> {
    return assignSobokuProp<T, StateProp<T>>({ _state: initial });
}

export function setState<T>(soboku: State<T>, state: T): T {
    soboku._state = state;
    emitListeners(soboku._listeners, state);
    return state;
}

export function  getState<T>(target: Soboku<T>): T {
    if (isCalc(target))
        return target._getter();
    return target._state;
}
