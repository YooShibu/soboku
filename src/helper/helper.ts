export function spyOnAll<T>(obj: T): T {
    for (let key in obj)
        spyOn(obj, key);
    return obj;
}

export function add(x: number, y: number): number {
    return x + y;
}
