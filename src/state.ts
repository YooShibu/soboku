import { Soboku, State, StateProp, Calc } from "../index.d";
import { createSoboku } from "./soboku";
import { emitListeners } from "./event";
import { has } from "./util";


export function state<T> (initial: T): State<T> {
    return createSoboku<T, StateProp<T>>({ _state: initial });
}

export function setState<T>(soboku: State<T>, state: T): T {
    soboku._state = state;
    emitListeners(soboku._listeners, state);
    return state;
}

export function  getState<T>(target: Soboku<T>): T {
    if (has(target, "_getter") === true)
        return (target as Calc<T>)._getter();
    return (target as State<T>)._state;
}
