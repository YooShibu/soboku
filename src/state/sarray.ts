import { ISArray } from "../../index.d";
import { ReporterClass } from "../reporter/reporter";


class SobokuArrayClass<T> extends ReporterClass<T[]> implements ISArray<T> {
    private readonly array: T[] = [];

    constructor(array?: T[]) {
        super();
        this.array = array || [];
    }
        
    public s(): T[] {
        return this.array;
    }

    public pop(): T | undefined {
        const result = this.array.pop();
        this.next(this.array);
        return result;
    }

    public push(): number {
        const i = Array.prototype.push.apply(this.array, arguments);
        this.next(this.array);
        return i;
    }

    public reverse(): T[] {
        this.array.reverse();
        this.next(this.array);
        return this.array;
    }

    public shift(): T | undefined {
        const result = this.array.shift();
        this.next(this.array);
        return result;
    }

    public sort(compareFn?: (a: T, b: T) => number): T[] {
        this.array.sort(compareFn);
        this.next(this.array);
        return this.array;
    }
    
    public splice(): T[] {
        Array.prototype.splice.apply(this.array, arguments);
        this.next(this.array);
        return this.array;
    }

    public unshift(): number {
        const result = Array.prototype.unshift.apply(this.array, arguments);
        this.next(this.array);
        return result;
    }

}

export function sarray<T>(array?: T[]): ISArray<T> {
    return new SobokuArrayClass<T>(array);
}