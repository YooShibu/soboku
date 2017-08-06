import { trigger, ntrigger } from "./trigger";
import { editer } from "./editer";
import { state } from "../state/state";
import { spyOnAll } from "../helper/helper";


describe("trigger", () => {

    it("should emit listeners with true when condition turns true", () => {
        const x = state(0);
        const y = state(0);
        const isXGreaterThanY = trigger(editer((x: number, y: number) => x > y, [x, y]));
        const r = spyOnAll({ f() {} });
        isXGreaterThanY.report(r.f);
        y.next(10);
        x.next(2);
        x.next(12);

        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith(true);
    });
    it("should implements IStateHolder", () => {
        const t = trigger(editer(((x: number) => x > 10), [10]));
        expect(t.s()).toBeFalsy();
    });
        
});

describe("ntrigger", () => {

    it("should emit listeners with true when condition turns false", () => {
        const x = state(0);
        const y = state(0);
        const isNotXGreaterThanY = ntrigger(editer((x: number, y: number) => x > y, [x, y]));
        const r = spyOnAll({ f() {} });
        isNotXGreaterThanY.report(r.f);
        y.next(10);
        x.next(2);
        x.next(12);

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith(true);
    });
    it("should implements IStateHolder", () => {
        const t = ntrigger(editer(((x: number) => x > 10), [10]));
        expect(t.s()).toBeTruthy();
    });
    
});