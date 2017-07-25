import { Listener, SobokuProp } from "../index.d";
import { getState } from "./state";

export function emitListeners<T>(listeners: Listener<T>[], val: T) {
    for (let i = 0; listeners.length > i; ++i)
        listeners[i](val);
}

export function on<T, L extends Listener<T>>(target: SobokuProp<T>, listener: L): L {
    target._listeners.push(listener);
    return listener;
}

export function removeListener<T>(target: SobokuProp<T>, listener: Listener<T>): void {
    const listeners = target._listeners;
    const i = listeners.indexOf(listener);
    listeners.splice(i, 1);
}
