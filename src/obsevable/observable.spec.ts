import { ObservableErrorGate, UnhandledObservableError } from "./observable";
import { spyOnAll } from "../helper/helper";


describe("observable", () => {

    describe("ObservableErrorGate", () => {
        it("should throw error if it has no listener", () => {
            const eg = new ObservableErrorGate();
            expect(() => eg.next(new Error("err"))).toThrow();
        });
        it("should pass error to listeners", () => {
            const r = spyOnAll({ f() {} });
            const eg = new ObservableErrorGate();
            eg.report(r.f);
            eg.next(new Error("err"));

            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith(new Error("err"));
        });
    });

    describe("UnhandledObservableError", () => {
        it("should create error from error", () => {
            const e = new UnhandledObservableError(new TypeError("err"));
            expect(e.name).toBe("UnhandledObservableError");
            expect(e.message).toBe("Unhandled observable error: TypeError: err");
        });
    });
    
});