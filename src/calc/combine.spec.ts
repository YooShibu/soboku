import { combine } from "./combine";
import { dependency } from "./dependency";
import { state } from "../state/state";
import { gate } from "../reporter/gate";
import { spyOnAll } from "../helper/helper";


describe("combine", () => {
    it("should combine atoms to object", () => {
        const first = state("");
        const last = state("");
        const full = dependency((f: string, l: string) => `${f} ${l}`.trim(), first, last);
        const name = combine({ first, last, full, age: 10 });
        expect(name.s()).toEqual({
            first: "", last: "", full: "", age: 10
        });
    });
    it("should emit listener some state updated", () => {
        const first = state("");
        const last = state("");
        const full = dependency((f: string, l: string) => `${f} ${l}`.trim(), first, last);
        const name = combine({ first, last, full });
        const postcode = state("");
        const address = combine({ postcode });
        const person = combine({ name, address });
        const r = spyOnAll({ f() {} });
        person.report(r.f);
        first.next("Nobunaga");
        last.next("Oda");

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith({
            name: { first: "Nobunaga", last: "", full: "Nobunaga" },
            address: { postcode: "" }
        });
        expect(r.f).toHaveBeenCalledWith({
            name: { first: "Nobunaga", last: "Oda", full: "Nobunaga Oda" },
            address: { postcode: "" }
        });
    });
});
