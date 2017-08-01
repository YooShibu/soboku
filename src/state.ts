import { Soboku, State, StateProp, Calc } from "../index.d";
import { assignSobokuProp } from "./soboku";
import { emitListeners } from "./event";
import { has, isState, isCalc } from "./util";


export function state<T> (initial: T): State<T> {
    return assignSobokuProp<T, StateProp<T>>({ _state: initial });
}

export function setState<T>(soboku: State<T>, state: T): T {
    soboku._state = state;
    emitListeners(soboku, state);
    return state;
}

export function  getState<T>(target: Soboku<T> | T): T {
    if (isCalc(target))
        return target._getter();
    if (isState(target))
        return target._state;
    return target;
}
