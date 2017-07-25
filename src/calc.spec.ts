import { Listener } from "../index.d";
import { getDepends, dependency, combineSoboku, combine, addCalcEmitterToDepends } from "./calc";
import { state, getState, setState } from "./state";
import { on } from "./event";
import { optimizeCB } from "./util";
import { spyOnAll, add } from "./helper/helper";


function cFullName(first: string, last: string) {
    return `${first} ${last}`.trim();
}

describe("calc", () => {

    describe("getDepends", () => {
        it("should get _depends or itself from sobokus", () => {
            const x = state(0);
            const y = dependency((num: number) => num * 2, x);
            expect(getDepends([x, y])).toEqual([x]);
        });
    });
    

    describe("dependency", () => {
        it("should create dependency state", () => {
            const spys = spyOnAll({ f() {} });
            const firstName = state("");
            const lastName = state("");
            const fullName = dependency(cFullName, firstName, lastName);
            expect(getState(fullName)).toBe("");
            on(fullName, spys.f);
            setState(firstName, "Nobunaga");
            setState(lastName, "Oda");
            expect(spys.f).toHaveBeenCalledWith("Nobunaga");
            expect(spys.f).toHaveBeenCalledWith("Nobunaga Oda");
            expect(getState(fullName)).toBe("Nobunaga Oda");
        });
    });

    describe("combineSoboku", () => {
        it("should combine sobokus into single object", () => {
            const first = state("");
            const last = state("");
            const name = combineSoboku({ first, last });
            expect(name).toEqual({ first: "", last: "" });
        });
    });
    
    describe("combine", () => {
        it("should combine states into single object", () => {
            const firstName = state("");
            const lastName = state("");
            const person = combine({ firstName, lastName });
            setState(firstName, "Nobunaga");
            setState(lastName, "Oda");
            expect(getState(person))
                .toEqual({ firstName: "Nobunaga", lastName: "Oda" });
        });
        it("should create state from combined state", () => {
            const firstName = state("");
            const lastName = state("");
            const postcode = state("");
            const city = state("");
            const name = combine({ first: firstName, last: lastName });
            const address = combine({ city, postcode });
            const person = combine({ name, address });
            expect(getState(person)).toEqual({
                name: {
                    first: "",
                    last: ""
                },
                address: {
                    city: "",
                    postcode: ""
                }
            });
        });
    });

    describe("addCalcEmitterToDepends", () => {
       it("should add Calc emitter to depends", () => {
           const x = state(0);
           const y = dependency(add, x, x);
           expect(x._listeners.length).toBe(1);
       }); 
    });

    describe("composit test", () => {
        it("should emit listener only one time", () => {
            const first = state(""),
                  last = state(""),
                  full = dependency((f, l) => `${f} ${l}`.trim(), first, last),
                  name = combine({ first, last, full });

            const receiver = spyOnAll({ f() {} });
            on(name, receiver.f);

            setState(first, "Oda");
            expect(receiver.f).toHaveBeenCalledTimes(1);
        });
        it("should emit listener only one time", () => {
            const x = state(0),
                  offset = state(10),
                  y = dependency(add, x, x),
                  z = dependency(add, y, offset),
                  point = combine({ x, y, z });
            
            const receiver = spyOnAll({ f() {} });
            on(point, receiver.f);

            setState(x, 10);
            setState(offset, 30);

            expect(receiver.f).toHaveBeenCalledWith({ x: 10, y: 20, z: 30});
            expect(receiver.f).toHaveBeenCalledWith({ x: 10, y: 20, z: 50 });
            expect(receiver.f).toHaveBeenCalledTimes(2);
        });
    });
    
});