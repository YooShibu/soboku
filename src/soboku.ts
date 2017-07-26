import { SobokuProp } from "../index.d";


export function assignSobokuProp<T, U>(props: U): SobokuProp<T> & U {
    const def: SobokuProp<T> = {
        __soboku__: true,
        _listeners: []
    };
    return Object.assign(def, props);
}