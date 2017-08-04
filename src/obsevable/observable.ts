import { Reporter, SObservable, SObservableWithError, IReporter } from "../../index.d";
import { SobokuReporterClass } from "../reporter";


export abstract class ObservableClass<I, O> implements SObservableWithError<I, O> {
    public abstract readonly input: Reporter<I>;
    public abstract readonly output: IReporter<O>;
    public readonly error = new ObservableErrorGate();
}

export class ObservableErrorGate extends SobokuReporterClass<Error> {

    public next(err: Error) {
        if (this.listenerCount() === 0) {
            throw new UnhandledObservableError(err);
        }
        return super.next(err);
    }
    
}

export class UnhandledObservableError extends Error {

    constructor(err: Error) {
        super(`Unhandled observable error: ${err.name}: ${err.message}`);
    }

    
}
UnhandledObservableError.prototype.name = "UnhandledObservableError"