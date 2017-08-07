import { Reporter, ISArray, ISObservable, IStateHolder } from "../../index.d";
import { SobokuReporterClass, SobokuListenerClass } from "../reporter/reporter";
import { convAtomToStateHolder } from "../state/state";
import { SObservableClass } from "./observable";


function isEqual(x: any, y: any): boolean {
    return x === y;
}

class SequenceEqualClass<T> extends SObservableClass<Reporter<T>, true> {
    public readonly input = new SobokuReporterClass<T>();
    private readonly compare: (x: any, y: any) => boolean;
    private readonly sequence: IStateHolder<T[]>;
    private i = 0;

    constructor(sequence: T[] | ISArray<T>, compare = isEqual) {
        super();
        this.compare = compare;
        this.sequence =  convAtomToStateHolder(sequence);
        this.input.report(new SobokuListenerClass(this.checkInput, this));
    }

    private checkInput(val: T): void {
        const sequence = this.sequence.s();
        if (this.compare(sequence[this.i], val) === false) {
            this.i = 0;
            return;
        }
        if (++this.i === sequence.length) {
            this.i = 0;
            this.output.next(true);
        }
    }
    
}

export function sequenceEqual<T>(sequence: T[] | ISArray<T>, compareFunc?: (x: T, y: T) => boolean): ISObservable<Reporter<T>, true> {
    return new SequenceEqualClass(sequence, compareFunc);
}