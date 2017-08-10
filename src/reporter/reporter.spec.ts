import { reporter } from "./reporter";
import { Reporter } from "../../index.d";
import { spyOnAll } from "../helper/helper";


describe("reporter", () => {
    let r: { f1: () => any, f2: () => any }, rep: Reporter<string>;
    beforeEach(() => {
        r = spyOnAll({ f1() {}, f2() {} });
        rep = reporter();
    });

    describe("emitListeners", () => {
        it("should pass the arguemnt to listeners", () => {
            rep.report(r.f1);
            rep.report(r.f2);
            rep.next("hello");

            expect(r.f1).toHaveBeenCalledTimes(1);
            expect(r.f1).toHaveBeenCalledWith("hello");
            expect(r.f2).toHaveBeenCalledTimes(1);
            expect(r.f2).toHaveBeenCalledWith("hello");
        });
    });

    describe("report", () => {
        it("should return unsubscriber", () => {
            const unsubscriber = rep.report(r.f1);
            rep.next("hello");
            unsubscriber.unsubscribe();
            unsubscriber.unsubscribe();
            rep.next("good bye");

            expect(r.f1).toHaveBeenCalledTimes(1);
            expect(r.f1).toHaveBeenCalledWith("hello");
        });
        it("should throw error if listener is not typeof function", () => {
            expect(() => rep.report(100 as any))
                .toThrowError("'listener' must be a function");
        });
    });

    describe("reportOnce", () => {
        it("should unsubscribe listener when report", () => {
            rep.reportOnce(r.f1);
            rep.next("Hello");
            rep.next("See you");

            expect(r.f1).toHaveBeenCalledTimes(1);
            expect(r.f1).toHaveBeenCalledWith("Hello");
        });
    });
    
    describe("listenerCount", () => {
        it("should return listener count", () => {
            expect(rep.listenerCount()).toBe(0);
            const unsubscriber = rep.report(r.f1);
            expect(rep.listenerCount()).toBe(1);
            unsubscriber.unsubscribe();
            expect(rep.listenerCount()).toBe(0);
        });
    });
    
});