import { sequenceEqual } from "./sequenceEqual";
import { IDefaultSpy, defaultSpy } from "../helper/helper";


describe("sequenceEqual", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());

    it("should pass true to listeners of output gate if inputs equals to sequence in order", () => {
        const seq = sequenceEqual(["s", "a", "y"]);
        seq.output.report(r.f);

        seq.input.next("s");
        seq.input.next("a");
        seq.input.next("y");

        seq.input.next("s");
        seq.input.next("s");
        seq.input.next("a");
        seq.input.next("a");
        seq.input.next("s");
        seq.input.next("a");
        seq.input.next("y");

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith(true);
    });
    
});