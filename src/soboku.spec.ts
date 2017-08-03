import { stream, state, gate } from "./soboku";
import { IDefaultSpy, defaultSpy } from "./helper/helper";


describe("soboku", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());
    
    describe("stream", () => {
        it("should emit listeners when next emitted", () => {
            const message = stream<string>();
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
        it("should emit listeners when next emitted", () => {
            const num = state(20);
            num.report(r.f);
            num.next(100);

            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith(100);
        });
    });

    describe("gate", () => {
        it("should emit listeners when reporter reports and gatekeeper is true", () => {
            const Biff = stream<string>();
            const earplug = state(false);
            const Marty = gate(earplug, Biff);
            Marty.report(r.f);
            Biff.next("Hello");
            Biff.next("Hello, hello, anybody home?");
            earplug.next(true);
            Biff.next("Butthead");
            
            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith("Butthead");
        });
    });
    
});