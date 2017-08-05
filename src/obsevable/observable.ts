import { Reporter, ISObservable } from "../../index.d";
import { SobokuReporterClass } from "../reporter/reporter";


export abstract class SObservable<I extends Reporter<any>, O> implements ISObservable<I, O> {
    public abstract readonly input: I;
    public readonly output = new SobokuReporterClass<O>();
}