import { Reporter, ISObservable } from "../../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";
import { state } from "../state/state";


export abstract class SObservable<I, O, T extends Reporter<I>> implements ISObservable<I, O, T> {
    public readonly input: T;
    public readonly output = new SobokuReporterClass<O>();
    public readonly error = new ObservableErrorClass();
    public readonly reset = new SobokuReporterClass<true>();

    constructor(input: T) {
        this.input = input;
        input.report(new SobokuListenerClass(this.onInput, this));
        this.reset.report(new SobokuListenerClass(this.onReset, this));
    }
    
    protected abstract onInput(val: I): void;
    protected abstract onReset(): void;

}

export  class ObservableErrorClass extends SobokuReporterClass<Error> {

    public next(err: Error) {
        if (this.listenerCount() === 0) {
            const unhandledError = new Error(`Unhandled observable error: ${err.name}: ${err.message}`);
            unhandledError.name = "UnhandledObservableErrorWarning";
            throw unhandledError;
        }
        return super.next(err);
    }
    
}