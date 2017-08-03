import { gate, state } from "./soboku";
import { spyOnAll } from "./helper/helper";


describe("soboku", () => {
    let r: { f: () => any };
    beforeEach(() => r = spyOnAll({ f() {} }));
    
    describe("gate", () => {
        it("should emit listeners when updated", () => {
            const message = gate<string>();
            message.report(r.f);
            message.next("Hello");

            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith("Hello");
        });
    });

    describe("state", () => {
        it("should have state", () => {
            const num = state(100);

            expect(num.s()).toBe(100);

            num.next(20);

            expect(num.s()).toBe(20);
        });
        it("should emit listeners when updated", () => {
            const num = state(20);
            num.report(r.f);
            num.next(100);

            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith(100);
        });
    });
    
});