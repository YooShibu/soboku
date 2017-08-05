import { reporter } from "./reporter";
import { Reporter } from "../../index.d";
import { spyOnAll } from "../helper/helper";


describe("reporter", () => {
    let r: { f1: () => any, f2: () => any }, g: Reporter<string>;
    beforeEach(() => {
        r = spyOnAll({ f1() {}, f2() {} });
        g = reporter();
    });

    describe("emitListeners", () => {
        it("should pass the arguemnt to listeners", () => {
            g.report(r.f1);
            g.report(r.f2);
            g.next("hello");

            expect(r.f1).toHaveBeenCalledTimes(1);
            expect(r.f1).toHaveBeenCalledWith("hello");
            expect(r.f2).toHaveBeenCalledTimes(1);
            expect(r.f2).toHaveBeenCalledWith("hello");
        });
    });

    describe("report", () => {
        it("should return unsubscriber", () => {
            const unsubscriber = g.report(r.f1);
            g.next("hello");
            unsubscriber.unsubscribe();
            unsubscriber.unsubscribe();
            g.next("good bye");

            expect(r.f1).toHaveBeenCalledTimes(1);
            expect(r.f1).toHaveBeenCalledWith("hello");
        });
        it("should throw error if listener is not typeof function", () => {
            expect(() => g.report(100 as any))
                .toThrowError("'listener' must be a function");
        });
    });

    describe("listenerCount", () => {
        it("should return listener count", () => {
            expect(g.listenerCount()).toBe(0);
            const unsubscriber = g.report(r.f1);
            expect(g.listenerCount()).toBe(1);
            unsubscriber.unsubscribe();
            expect(g.listenerCount()).toBe(0);
        });
    });
    
});