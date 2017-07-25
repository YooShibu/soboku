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

setState(first, "Oda");
// Oda
// { first: "Oda", last: "", full: "Oda" }

setState(last, "Nobunaga");
// Oda Nobunaga
// { first: "Oda", last: "Nobunaga", full: "Oda Nobunaga" }

~~~

## Api

### `state(initial)`
### `setState(state, currentState)`
### `getState(soboku)`
### `dependency(func, ...sobokus)`
### `combine(sobokuObj)`
### `on(soboku, listener, emitFirstTime = true)`
### `removeListener(soboku, listener)`
### `isSoboku(value)`

## LICENSE
MIT