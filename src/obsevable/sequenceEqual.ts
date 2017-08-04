import { Reporter, SObservable } from "../../index.d";
import { reporter } from "../soboku";
import { SobokuListenerClass } from "../reporter";


function isEqual(x: any, y: any): boolean {
    return x === y;
}

class SequenceEqualClass<T> implements SObservable<Reporter<T>, true> {
    public readonly input = reporter<T>();
    public readonly output = reporter<true>();
    private readonly compare: (x: any, y: any) => boolean;
    private readonly sequence: T[];
    private i = 0;

    constructor(sequence: T[], compare = isEqual) {
        this.compare = compare;
        this.sequence = sequence;
        this.input.report(this.checkInput, this);
    }

    private checkInput(val: T): void {
        const sequence = this.sequence;
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

export function sequenceEqual<T>(sequence: T[], compareFunc?: (x: T, y: T) => boolean) {
    return new SequenceEqualClass(sequence, compareFunc);
}