import { trigger } from "./trigger";
import { state } from "../state/state";
import { spyOnAll } from "../helper/helper";


describe("trigger", () => {

    it("should emit listeners with true when predicate returns true", () => {
        const x = state(0);
        const y = state(0);
        const isXGreaterThanY = trigger((x: number, y: number) => x > y, x, y);
        const r = spyOnAll({ f() {} });
        isXGreaterThanY.report(r.f);
        y.next(10);
        x.next(2);
        x.next(12);

        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith(true);
    });
    
});