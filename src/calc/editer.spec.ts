import { editer } from "./editer";
import { state } from "../state/state";
import { add, spyOnAll, twice } from "../helper/helper";


describe("editer", () => {
    let r: { f: () => any };
    beforeEach(() => r = spyOnAll({ f() {} }));
    
    it("should create Calc from function and Atoms", () => {
        const num = state(10);
        const added = editer(add, [num, 10]);
        
        expect(added.s()).toBe(20);
    });
    it("should emit listeners when state was changed", () => {
        const x = state(0);
        const y = editer(twice, [x]);
        const z = editer(add, [y, 30]);
        z.report(r.f);
        x.next(2);
        x.next(21);

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith(34);
        expect(r.f).toHaveBeenCalledWith(72);
    });
});
