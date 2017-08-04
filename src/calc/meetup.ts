import { Calc, IReporter, IStateHolder } from "../../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter";
import { getDeps } from "./calc";
import { isSobokuReporter } from "../util";


class MeetupClass extends SobokuReporterClass<true> implements IStateHolder<boolean> {
    private readonly end: number;
    private reported: (true | undefined)[];
    
    constructor(reporters: IReporter<any>[]) {
        super();
        const deps = getDeps(reporters);
        this.reported = new Array(this.end = deps.length);
        for (let i = 0; deps.length > i; ++i) {
            const listener = new MeetupListenerClass(i, this);
            deps[i].report(new SobokuListenerClass(listener.reported, listener));
        }
    }

    public meet(index: number) {
        const reported = this.reported;
        reported[index] = true;
        for (let i = 0; this.end > i; ++i) {
            if (reported[i] === undefined) {
                return;
            }
        }
        this.reported = new Array(reported.length);
        this.next(true);
    }

    public s(): boolean {
        return false;
    }

}

class MeetupListenerClass {

    constructor(private readonly index: number, private readonly meetup: MeetupClass) {}

    public reported() {
        this.meetup.meet(this.index);
    }
    
}

export function meetup(...reporters: IReporter<any>[]): Calc<boolean> {
    return new MeetupClass(reporters);
}