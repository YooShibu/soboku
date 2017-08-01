import { omit, optimizeCB, has, unique, identity, isCalc, isState } from "./util";
import { state } from "./state";
import { dependency, mirror } from "./calc";
import { spyOnAll } from "./helper/helper";


describe("util", () => {

    describe("omit", () => {
        it("should omit a key from object", () => {
            const source = { foo1: "", foo2: "", foo3: "" };
            expect(omit(source, "foo3")).toEqual({ foo1: "", foo2: "" } as any);
        });
    });

    describe("optimizeCB", () => {
        it("should optimize callback function", () => {
            const twice = (x: number) => x * 2;
            const add = (x: number, y: number) => x + y;
            const add3 = (x: number, y: number, z: number) => x + y + z;
            const add4 = (x: number, y: number, z: number, a: number) => x + y + z + a;
            const sum = (...nums: number[]) => nums.reduce(add, 0);

            const _twice = optimizeCB(twice);
            const _add = optimizeCB(add);
            const _add3 = optimizeCB(add3);
            const _add4 = optimizeCB(add4);
            const _sum = optimizeCB(sum);
            
            expect(_twice([4])).toBe(8);
            expect(_add([1, 2])).toBe(3);
            expect(_add3([1, 2, 3])).toBe(6);
            expect(_add4([1, 2, 3, 4])).toBe(10);
            expect(_sum([1, 2, 3, 4, 5])).toBe(15);
        });
    });

    describe("has", () => {
        it("should create function that object has property", () => {
            interface Person {
                firstName: string;
                lastName: string;
            }
            const p: Partial<Person> = { firstName: "Jhon" };
            expect(has(p, "firstName")).toBeTruthy();
            expect(has(p, "lastName")).toBeFalsy();
        });
    });
    
    describe("unique", () => {
        it("should get unique values from array", () => {
            const source = [1, 2, 1, 3, 2, 1];
            const result = unique(source).sort();
            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe("identity", () => {
        it("should return argument", () => {
            const source = [1, 2, 3];
            const result = identity(source);
            expect(result).toBe(source);
        });
    });

    describe("isCalc", () => {
        it("should return true if arguemnt is Calc", () => {
            const a = state(0);
            const b = mirror(a);
            expect(isCalc(b)).toBeTruthy();
        });
        it("should return false if argument is State", () => {
            const a = state(0);
            expect(isCalc(a)).toBeFalsy();
        });
    });

    describe("isState", () => {
        it("should return true if argument is State", () => {
            const a = state(0);
            expect(isState(a)).toBeTruthy();
        });
        it("should return false if argument is not State", () => {
            const a = mirror(state(0));
            expect(isState(a)).toBeFalsy();
        });
    });

});