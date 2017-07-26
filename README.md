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

### `state(initial)`
### `setState(state, currentState)`
### `getState(soboku)`
### `dependency(func, ...sobokus)`
### `combine(sobokuObj)`
### `mirror(state)`
### `on(soboku, listener, emitFirstTime = true)`
### `removeListener(soboku, listener)`
### `isSoboku(value)`

## LICENSE
MIT