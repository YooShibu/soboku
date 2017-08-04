import { publisher } from "./publisher";
import { state } from "../soboku";
import { dependency } from "./dependency";
import { IDefaultSpy, defaultSpy } from "../helper/helper";

function every(...args: any[]) {
    return args.every(a => a === true);
}

describe("publisher", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());

    it("should publish report when permition turns true and it is true", () => {
        const _num = state(10);
        const work1 = state(false);
        const work2 = state(false);
        const complete = dependency(every, work1, work2);
        const num = publisher(complete, _num);
        num.report(r.f);

        _num.next(100);
        _num.next(20);
        work1.next(true);
        work2.next(true);
        _num.next(200);
        
        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith(20);
        expect(r.f).toHaveBeenCalledWith(200);
    });
    
});