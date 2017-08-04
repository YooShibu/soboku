import { Listener, IReporter, ISobokuListener, IUnListener } from "../index.d";
import * as u from "./util";


class UnListenerClass<T> implements IUnListener {
    private listeners: ISobokuListener<any>[] | null;
    private listener: ISobokuListener<T> | null;
    
    constructor(listeners: ISobokuListener<any>[], listener: ISobokuListener<T>) {
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

export class SobokuListenerClass<T> implements ISobokuListener<T> {

    constructor(private readonly listener: Listener<T>, private readonly thisArg?: any) {
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }

    public gets(news: T) {
        this.listener.call(this.thisArg, news);
    }
    
}

export function listener<T>(cb: Listener<T>, thisArg?: any): ISobokuListener<T> {
    return new SobokuListenerClass(cb, thisArg);
}

export class SobokuReporterClass<T> implements IReporter<T> {
    private readonly listeners: ISobokuListener<T>[] = [];

    public next(val: T): T {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i)
            listeners[i].gets(val);
        return val;
    }

    public report(listener: Listener<T> | ISobokuListener<T>): IUnListener {
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