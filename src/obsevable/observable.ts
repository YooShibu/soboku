import { Reporter, SObservable } from "../../index.d";
import { SobokuReporterClass } from "../reporter/reporter";


export abstract class SObservableClass<I extends Reporter<any>, O> implements SObservable<I, O> {
    public abstract readonly input: I;
    public readonly output = new SobokuReporterClass<O>();
}