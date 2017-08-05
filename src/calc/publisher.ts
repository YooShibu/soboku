import { Calc, IStateHolder } from "../../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";


class PublisherClass<T> extends SobokuReporterClass<T> implements IStateHolder<T> {

    constructor(private readonly permition: Calc<boolean>, private readonly reporter: Calc<T>) {
        super();
        permition.report(this.permitionChanged, this);
        reporter.report(this.publish, this);
    }

    public s(): T {
        return this.reporter.s();
    }
    
    private publish(val: T) {
        if (this.permition.s())
            this.next(val);
    }

    private permitionChanged(permition: boolean) {
        if (permition)
            this.next(this.reporter.s());
    }
    
}

export function publisher<T>(permition: Calc<boolean>, reporter: Calc<T>): Calc<T> {
    return new PublisherClass(permition, reporter);
}