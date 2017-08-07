import { Atom, Calc, IStateHolder } from "../../index.d";
import { SobokuListenerClass } from "../reporter/reporter";
import * as u from "../util";
import { CalcClass } from "./calc";


class TriggerClass extends CalcClass<boolean> {

    constructor(private readonly condition: Calc<boolean>) {
        super();
        const listener = new SobokuListenerClass(this.onConditionChanged, this);
        super.addDepends([condition], listener);
    }

    private onConditionChanged() {
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
