[![Build Status](https://travis-ci.org/YooShibu/soboku.svg?branch=master)](https://travis-ci.org/YooShibu/soboku)
[![codecov](https://codecov.io/gh/YooShibu/soboku/branch/master/graph/badge.svg)](https://codecov.io/gh/YooShibu/soboku)


# soboku

A javascript package to manage the app state.

## Installation

    npm install soboku

## Example
~~~ typescript
import { state, combine, dependency, on, setState, getState } from "soboku"

const first = state(""),
      last = state(""),
      full = dependency((f, l) => `${f} ${l}`.trim(), first, last),
      name = combine({ first, last, full });

const log = console.log;

log(getState(name));
// { first: "", last: "", full: "" }

on(full, log);
on(name, log);

setState(first, "Nobunaga");
// Nobunaga
// { first: "Nobunaga", last: "", full: "Nobunaga" }

setState(last, "Oda");
// Nobunaga Oda
// { first: "Nobunaga", last: "Oda", full: "Nobunaga Oda" }

~~~

## API

### `state<T>(initial: T): State<T>`
### `setState<T>(state: State<T>, currentState: T): T`
### `getState(soboku: Soboku<T>): T`
### `dependency<T>(func: (...sobokus: Soboku<any>[]) => T, ...sobokus: Soboku<any>[]): Calc<T>`
### `combine<T>(sobokuObj: { [K in keyof T]: Soboku<T[K]> }): Calc<T>`
### `mirror<T>(state: State<T>): Calc<T>`
### `on<T>(soboku: SobokuProp<T>, listener: (val: T) => void)`
### `removeListener<T>(soboku: SobokuProp<T>, listener: (val: T) => void)`
### `isSoboku(value: any): boolean`

## Top-Level API

### `emitListener<T>(prop: SobokuProp<T>, value: T): void`
### `assignSobokuProp<T, U>(props: U): SobokuProp<T> & U`

## LICENSE
MIT