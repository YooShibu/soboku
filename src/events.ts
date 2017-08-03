import { Listener, IReporter, SobokuListener, UnListener } from "../index.d";
import * as u from "./util";


class UnListenerClass<T> implements UnListener {
    private listeners: SobokuListener<any>[] | null;
    private listener: SobokuListener<T> | null;
    
    constructor(listeners: SobokuListener<any>[], listener: SobokuListener<T>) {
        this.listeners = listeners;
        this.listener = listener;
    }

    public unlisten() {
        const listeners = this.listeners;
        if (listeners === null) {
            return;
        }
        const i = u.indexOf(listeners, this.listener);
        u.spliceOne(listeners, i);
        this.listeners = null;
        this.listener = null;
    }
    
}

export class SobokuListenerClass<T> implements SobokuListener<T> {

    constructor(private readonly listener: Listener<T>, private readonly thisArg?: any) {
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }

    public emit(val: T) {
        this.listener.call(this.thisArg, val);
    }
    
}

export function listener<T>(cb: Listener<T>, thisArg?: any): SobokuListener<T> {
    return new SobokuListenerClass(cb, thisArg);
}

export abstract class SobokuReporterClass<T> implements IReporter<T> {
    private readonly listeners: SobokuListener<T>[] = [];

    protected emitListener(val: T): T {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i)
            listeners[i].emit(val);
        return val;
    }

    public report(listener: Listener<T> | SobokuListener<T>): UnListener {
        const _listener = u.isSobokuListener(listener)
            ? listener
            : new SobokuListenerClass(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }

    public listenerCount(): number {
        return this.listeners.length;
    }

}