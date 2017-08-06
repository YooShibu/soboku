import { Atom, Calc, IStateHolder } from "../../index.d";
import { SobokuReporterClass } from "../reporter/reporter";
import * as u from "../util";
import { getState } from "./calc";


class TriggerClass extends SobokuReporterClass<boolean> implements IStateHolder<boolean> {

    constructor(private readonly condition: Calc<boolean>) {
        super();
        condition.report(this.listener, this);
    }

    public listener() {
        const s = this.s();
        if (s)
            this.next(s);
    }

    public s() {
        return this.condition.s();
    }

}

class NTriggerClass extends TriggerClass {

    public s() {
        return !super.s()
    }
    
}

export function trigger(condition: Calc<boolean>): Calc<boolean> {
    return new TriggerClass(condition);
}

export function ntrigger(condition: Calc<boolean>): Calc<boolean> {
    return new NTriggerClass(condition);
}
