import * as u from "./util";
import { state } from "./state/state";
import { reporter } from "./reporter/reporter";
import { dependency } from "./calc/dependency";
import { spyOnAll, twice } from "./helper/helper";


describe("util", () => {

    describe("has", () => {
        it("should create function that object has property", () => {
            interface Person {
                firstName: string;
                lastName: string;
            }
            const p: Partial<Person> = { firstName: "Jhon" };

            expect(u.has(p, "firstName")).toBeTruthy();
            expect(u.has(p, "lastName")).toBeFalsy();
        });
    });
    
    describe("identity", () => {
        it("should return argument", () => {
            const source = [1, 2, 3];
            const result = u.identity(source);

            expect(result).toBe(source);
        });
    });

    describe("indexOf", () => {
        const source = [1, 2, 3, 4, 2, 5];
        it("should return first index if val contained in the array", () => {
            const result = u.indexOf(source, 2);
            expect(result).toBe(1);
        });
        it("should return -1 if array has no val", () => {
            const result = u.indexOf(source, 100);
            expect(result).toBe(-1);
        });
    });

    describe("map", () => {
        it("should call iteratee with each value in array", () => {
            const result = u.map([1, 2, 3, 4], twice);
            expect(result).toEqual([2, 4, 6, 8]);
        });
    });

    describe("mapObj", () => {
        it("should pass each value in obj to iteratee", () => {
            const result = u.mapObj({ foo: 20, bar: 100 }, twice);
            expect(result).toEqual({ foo: 40, bar: 200 });
        });
    });

    describe("optimizeCB", () => {
        it("should optimize callback function", () => {
            const twice = (x: number) => x * 2;
            const add = (x: number, y: number) => x + y;
            const add3 = (x: number, y: number, z: number) => x + y + z;
            const add4 = (x: number, y: number, z: number, a: number) => x + y + z + a;
            const sum = (...nums: number[]) => nums.reduce(add, 0);

            const _twice = u.optimizeCB(twice);
            const _add = u.optimizeCB(add);
            const _add3 = u.optimizeCB(add3);
            const _add4 = u.optimizeCB(add4);
            const _sum = u.optimizeCB(sum);
            
            expect(_twice([4])).toBe(8);
            expect(_add([1, 2])).toBe(3);
            expect(_add3([1, 2, 3])).toBe(6);
            expect(_add4([1, 2, 3, 4])).toBe(10);
            expect(_sum([1, 2, 3, 4, 5])).toBe(15);
        });
    });

    describe("spliceOne", () => {
        it("should remove val of index from array", () => {
            const source1 = [1, 2, 3];
            const source2 = [1, 2, 3];
            const source3 = [1, 2, 3];
            u.spliceOne(source1, 2);
            u.spliceOne(source2, 1);
            u.spliceOne(source3, 0);

            expect(source1).toEqual([1, 2]);
            expect(source2).toEqual([1, 3]);
            expect(source3).toEqual([2, 3]);
        });
        it("should nothing to do if index is smaller than 0", () => {
            const source = [1, 2, 3];
            u.spliceOne(source, -1);
            expect(source).toEqual([1, 2, 3]);
        });
    });

    describe("unique", () => {
        it("should get unique values from array", () => {
            const source = [1, 2, 1, 3, 2, 1];
            const result = u.unique(source).sort();

            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe("isSobokuEvent", () => {
        it("should return true if argument is instance of SobokuEventClass", () => {
            expect(u.isSobokuReporter(state(100))).toBeTruthy();
            expect(u.isSobokuReporter(undefined)).toBeFalsy();
        });
    });

    describe("isStateHolder", () => {
        it("should return true if argument is object and has 's' key", () => {
            expect(u.isStateHolder(state(100))).toBeTruthy();
            expect(u.isStateHolder(reporter())).toBeFalsy();
        });
    });

    describe("isDepends", () => {
       it("should return true if argument is Depends", () => {
           const s = state(10);
           const d = dependency(twice, s);
           expect(u.isDepends(d)).toBeTruthy();
           expect(u.isDepends(s)).toBeFalsy();
       }); 
    });

});