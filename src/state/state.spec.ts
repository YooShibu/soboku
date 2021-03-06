import { state } from "./state";
import { ISArray } from "../../index.d";
import { IDefaultSpy, defaultSpy } from "../helper/helper";


describe("state", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());

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
