import { Reporter, SObservable, SObservableWithError, IReporter } from "../../index.d";
import { SobokuReporterClass } from "../events";


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
        this.tellNews(err);
    }
    
}

export class UnhandledObservableError extends Error {

    constructor(err: Error) {
        super(`Unhandled observable error: ${err.name}: ${err.message}`);
    }

    
}
UnhandledObservableError.prototype.name = "UnhandledObservableError"