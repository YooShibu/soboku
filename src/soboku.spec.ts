import { assignSobokuProp } from "./soboku";
import { SobokuProp, State, StateProp } from "../index.d";


describe("soboku", () => {

    describe("assignSobokuProp", () => {
        it("should create basic soboku from empty object", () => {
            const soboku = assignSobokuProp({});
            expect(soboku).toEqual({
                __soboku__: true,
                _listeners: [],
            });
        });
        it("should create soboku with assigned partial props", () => {
            const soboku = assignSobokuProp({ _state: "" });
            const result: State<string> = {
                __soboku__: true,
                _listeners: [],
                _state: ""
            };
            expect(soboku).toEqual(result);
        });
    });
    
});