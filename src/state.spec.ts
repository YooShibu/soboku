import { state, setState, getState } from "./state";
import { SobokuProp } from "../index.d";
import { assignSobokuProp } from "./soboku";
import { on } from "./event";
import { combine } from "./calc";
import { has } from "./util";
import { spyOnAll } from "./helper/helper";


describe("state", () => {

    describe("state", () => {
        it("should create state ", () => {
            const firstName = state("");
            expect(firstName._state).toBe("");
        });
    });

    describe("getState", () => {
        it("should get the current state", () => {
            const firstName = state("");
            expect(getState(firstName)).toBe("");
        });
        it("should calc the current state from _getter function", () => {
            const firstName = state(""),
                  lastName = state(""),
                  person = combine({ firstName, lastName });
            expect(getState(person)).toEqual({ firstName: "", lastName: "" });
        });
    });

    describe("setState", () => {
        it("should update the state", () => {
            const name = state("");
            setState(name, "Oda Nobunaga");
            expect(getState(name)).toBe("Oda Nobunaga");
        });
        it("should emit listener with the state", () => {
            const receiver = spyOnAll({ f() {} });
            const name = state("");
            on(name, receiver.f);
            setState(name, "Oda Nobunaga");
            setState(name, "Takeda Shingen");
            expect(receiver.f).toHaveBeenCalledWith("Oda Nobunaga");
            expect(receiver.f).toHaveBeenCalledWith("Takeda Shingen");
        });
    });
    
});