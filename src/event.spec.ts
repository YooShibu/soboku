import { emitListeners, on, removeListener } from "./event";
import { state } from "./state";
import { spyOnAll } from "./helper/helper";


describe("event", () => {

    describe("emitListeners", () => {
        it("should pass the arguemnt to listeners", () => {
            const receivers = spyOnAll({ f1() {}, f2() {}, f3() {} });
            const listeners = [receivers.f1, receivers.f2, receivers.f3];
            emitListeners(listeners, "Hello");
            expect(receivers.f1).toHaveBeenCalledWith("Hello");
            expect(receivers.f2).toHaveBeenCalledWith("Hello");
            expect(receivers.f3).toHaveBeenCalledWith("Hello");
        });
    });

    describe("on", () => {
        it("should add listener to the listeners", () => {
            const str = state("STRING");
            const receivers = spyOnAll({ f() {} });
            on(str, receivers.f);
            expect(str._listeners.length).toBe(1);
            expect(receivers.f).toHaveBeenCalledTimes(0);
        });

        it("should return listener", () => {
            const str = state("STRING");
            const listener = (s: string) => {};
            expect(on(str, listener)).toBe(listener);
        });
    });
    
    describe("removeListener", () => {
        it("should remove listener from soboku", () => {
            const str = state("");
            const listener = on(str, (s: string) => {});
            expect(str._listeners.length).toBe(1);
            removeListener(str, listener);
            expect(str._listeners.length).toBe(0);
        });
    });
});