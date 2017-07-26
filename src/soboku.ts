import { SobokuProp } from "../index.d";


export function getSobokuProp<T>(): SobokuProp<T> {
    return {
        __soboku__: true,
        _listeners: []
    };
}


export function assignSobokuProp<T, U>(props: U): SobokuProp<T> & U {
    return Object.assign(getSobokuProp(), props);
}