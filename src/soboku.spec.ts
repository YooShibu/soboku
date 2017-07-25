import { createSoboku } from "./soboku";
import { SobokuProp, State, StateProp } from "../index.d";


describe("soboku", () => {

    describe("createSoboku", () => {
        it("should create basic soboku from empty object", () => {
            const soboku = createSoboku({});
            expect(soboku).toEqual({
                __soboku__: true,
                _listeners: [],
            });
        });
        it("should create soboku with assigned partial props", () => {
            const soboku = createSoboku({ _state: "" });
            const result: State<string> = {
                __soboku__: true,
                _listeners: [],
                _state: ""
            };
            expect(soboku).toEqual(result);
        });
    });
    
});