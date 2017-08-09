import { Calc, IStateHolder } from "../../index.d";
import { ReporterClass, SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";
import { CalcClass } from "./calc";


class PublisherClass<T> extends CalcClass<T> {
    private prevPermition: boolean;

    constructor(private readonly permition: Calc<boolean>, private readonly reporter: Calc<T>) {
        super();
        this.prevPermition = permition.s();
        super.addDepends([permition], new SobokuListenerClass(this.permitionChanged, this));
        super.addDepends([reporter], new SobokuListenerClass(this.publish, this));
    }

    public s(): T {
        return this.reporter.s();
    }
    
    private publish() {
        if (this.permition.s()) {
            this.next(this.reporter.s());
        }
    }

    private permitionChanged() {
        const permition = this.permition.s();
        if (permition && this.prevPermition === false) {
            this.next(this.reporter.s());
        }
        this.prevPermition = permition;
    }
    
}

export function publisher<T>(permition: Calc<boolean>, reporter: Calc<T>): Calc<T> {
    return new PublisherClass(permition, reporter);
}
