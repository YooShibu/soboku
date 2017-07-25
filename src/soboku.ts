import { SobokuProp } from "../index.d";


export function createSoboku<T, U>(params: U): SobokuProp<T> & U {
    const def: SobokuProp<T> = {
        __soboku__: true,
        _listeners: []
    };
    return Object.assign(def, params);
}