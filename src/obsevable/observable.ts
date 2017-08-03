import { Observable, SobokuEvents } from "../../index.d";
import { gate } from "../soboku";
import { SobokuEventsClass } from "../events";


export abstract class ObservableClass<I extends SobokuEvents<any>, O> implements Observable<I, O> {
    public abstract readonly input: I;
    public abstract readonly output: SobokuEvents<O>;
    public readonly error = new ObservableErrorGate();
}

export class ObservableErrorGate extends SobokuEventsClass<Error> {

    public next(err: Error) {
        if (this.listenerCount() === 0) {
            throw new UnhandledObservableError(err);
        }
        this.emitListener(err);
    }
    
}

export class UnhandledObservableError extends Error {

    constructor(err: Error) {
        super(`Unhandled observable error: ${err.name}: ${err.message}`);
    }

    
}
UnhandledObservableError.prototype.name = "UnhandledObservableError"