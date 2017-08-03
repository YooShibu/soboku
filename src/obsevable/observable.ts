import { Reporter, SObservable, SObservableWithError, SobokuEvents } from "../../index.d";
import { SobokuEventsClass } from "../events";


export abstract class ObservableClass<I, O> implements SObservableWithError<I, O> {
    public abstract readonly input: Reporter<I>;
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