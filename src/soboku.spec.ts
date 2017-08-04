import { reporter, state, gate, sarray } from "./soboku";
import { IDefaultSpy, defaultSpy } from "./helper/helper";


describe("soboku", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());
    
    describe("stream", () => {
        it("should emit listeners when next emitted", () => {
            const message = reporter<string>();
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
            const Biff = reporter<string>();
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

    describe("sarray", () => {
        it("should create sarray from array", () => {
            const arr = sarray([1, 2, 3]);
            expect(arr).not.toEqual([1, 2, 3]);
            expect(arr[0]).toBe(1);
            expect(arr[1]).toBe(2);
            expect(arr[2]).toBe(3);
        });
        it("should report when pop", () => {
            const arr = sarray([1, 2, 3]);
            arr.r.report(r.f);
            arr.pop();
            console.log(Object.prototype.toString.call(arr));
            expect(r.f).toHaveBeenCalledTimes(1);
            expect(r.f).toHaveBeenCalledWith([1, 2]);
        });
    });
    
});