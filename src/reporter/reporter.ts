import { Listener, IReporter, IListener, IUnsubscriber, Reporter } from "../../index.d";
import * as u from "../util";


class UnListenerClass<T> implements IUnsubscriber {
    private listeners: SobokuListenerClass<any>[] | null;
    private listener: SobokuListenerClass<T> | null;
    
    constructor(listeners: SobokuListenerClass<any>[], listener: SobokuListenerClass<T>) {
        this.listeners = listeners;
        this.listener = listener;
    }

    public unsubscribe() {
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

export class SobokuListenerClass<T> implements IListener<T> {

    constructor(private readonly listener: Listener<T>, private readonly thisArg?: any) {
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }

    public read(news: T) {
        this.listener.call(this.thisArg, news);
    }
    
}

export class SobokuReporterClass<T> implements IReporter<T> {
    private readonly listeners: SobokuListenerClass<T>[] = [];

    public next(val: T): T {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i)
            listeners[i].read(val);
        return val;
    }

    public report(listener: Listener<T> | SobokuListenerClass<T>): IUnsubscriber {
        const _listener = listener instanceof SobokuListenerClass
            ? listener
            : new SobokuListenerClass(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }

    public listenerCount(): number {
        return this.listeners.length;
    }

}

export function reporter<T>(): Reporter<T> {
    return new SobokuReporterClass();
}

export function listener<T>(listener: Listener<T>, thisArg?: any): SobokuListenerClass<T> {
    return new SobokuListenerClass(listener, thisArg);
}
