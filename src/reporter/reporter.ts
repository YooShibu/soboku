import { Listener, IReporter, IListener, IProgressable, IUnsubscriber, Reporter } from "../../index.d";
import * as u from "../util";


class UnListenerClass<T> implements IUnsubscriber {
    private listeners: IListener<any>[] | null;
    private listener: IListener<T> | null;
    
    constructor(listeners: IListener<any>[], listener: IListener<T>) {
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

export class ListenerClass<T> implements IListener<T> {

    constructor(private readonly listener: Listener<T>, private readonly thisArg?: any) {
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }

    public read(news: T) {
        this.listener.call(this.thisArg, news);
    }
    
}

class ListenerOnceClass<T> implements IListener<T> {
    public unsubscriber: IUnsubscriber;

    constructor(private readonly listener: IListener<T>) {}

    public read(news: T) {
        this.listener.read(news);
        this.unsubscriber.unsubscribe();
    }

}

export class ReporterClass<T> implements IReporter<T>, IProgressable<T> {
    private readonly listeners: IListener<T>[] = [];

    public next(val: T): T {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i) {
            listeners[i].read(val);
        }
        return val;
    }

    public report(listener: Listener<T> | ListenerClass<T>): IUnsubscriber {
        const _listener = toListener(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }

    public reportOnce(listener: Listener<T> | ListenerClass<T>): IUnsubscriber {
        const _listener = new ListenerOnceClass(toListener(listener));
        this.listeners.push(_listener);
        return _listener.unsubscriber = new UnListenerClass(this.listeners, _listener);
    }

    public listenerCount(): number {
        return this.listeners.length;
    }

}

function toListener<T>(listener: Listener<T> | ListenerClass<T>): ListenerClass<T> {
    return listener instanceof ListenerClass
        ? listener
        : new ListenerClass(listener);
}

export function reporter<T>(): Reporter<T> {
    return new ReporterClass();
}

export function listener<T>(listener: Listener<T>, thisArg?: any): ListenerClass<T> {
    return new ListenerClass(listener, thisArg);
}
