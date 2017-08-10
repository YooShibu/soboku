import { IReporter, IStateHolder } from "../../index.d";
import { ReporterClass, ListenerClass } from "./reporter";


class GateClass<T> extends ReporterClass<T> {

    constructor(private readonly gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>) {
        super();
        reporter.report(new ListenerClass(this.listener, this));
    }

    private listener(val: T): void {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    }
    
}

export function gate<T>(gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>): IReporter<T> {
    return new GateClass(gatekeeper, reporter);
}