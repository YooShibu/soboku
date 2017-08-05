import { sarray } from "./sarray";
import { ISobokuArray } from "../../index.d";
import { defaultSpy, IDefaultSpy } from "../helper/helper";


describe("sarray", () => {
    let r: IDefaultSpy, arr: ISobokuArray<number>;
    beforeEach(() => {
        r = defaultSpy();
        arr = sarray([1, 2, 3])
        arr.report(r.f);
    });

    it("should create sarray", () => {
        const arr = sarray();
        expect(arr.s()).toEqual([]);
    });
    it("should create sarray from array", () => {
        expect(arr.s()).toEqual([1, 2, 3]);
    });
    it("should report when pop", () => {
        arr.pop();

        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith([1, 2]);
    });
    it("should report when push", () => {
        arr.push();
        arr.push(1, 88, 3);

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith([1, 2, 3, 1, 88, 3]);
    });
    it("should report when reverse", () => {
        arr.reverse();
        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith([3, 2, 1]);
    });
    it("should report when shift", () => {
        const result = arr.shift();
        expect(result).toBe(1);
        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith([2, 3]);
    });
    it("should report when sort", () => {
        arr.push(-10);
        arr.sort();
        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith([-10, 1, 2, 3]);
    });
    it("should report when splice", () => {
        arr.splice(0, 2);
        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith([3]);
    });
    it("should report when unshift", () => {
        const result = arr.unshift(10, 8);
        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith([10, 8, 1, 2, 3]);
    });
});