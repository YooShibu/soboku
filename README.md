[![Build Status](https://travis-ci.org/YooShibu/soboku.svg?branch=master)](https://travis-ci.org/YooShibu/soboku)
[![codecov](https://codecov.io/gh/YooShibu/soboku/branch/master/graph/badge.svg)](https://codecov.io/gh/YooShibu/soboku)


# soboku

A javascript package to manage the app state.

## Installation

    npm install soboku

## Example
A countdown timer
~~~ typescript
import { state, gate, dependency, trigger, interval } from "soboku"


// -----------------------------------------
// Prepere countdown timer
// -----------------------------------------

function isZero(x: number) {
    return x === 0;
}

function isGreaterThan0(x: number) {
    return x > 0;
}

function getTimerMessage(isRunning: boolean) {
    return isRunning ? "Start!" : "Done!";
}

const _count = state(3),
      decCount = () => _count.next(_count.s() - 1),
      isEnd = trigger(isZero, _count),
      isCountGreaterThan0 = trigger(isGreaterThan0, _count),
      count = gate(isCountGreaterThan0, _count),
      timer = interval(1000),
      timerMessage = dependency(getTimerMessage, timer.input);
      
count.report(console.log);
timerMessage.report(console.log);
timer.output.report(decCount);
isEnd.report(end => timer.input.next(!end));


// -----------------------------------------
// Start countdown timer
// -----------------------------------------

timer.input.next(true);
// Start!
// 2
// 1
// Done!

~~~

## API

### `state<T>(initial: T): State<T>`
### `dependency<T>(func: (...atoms: Atom<any>[]) => T, ...atoms: Atom<any>[]): Calc<T>`
### `combine<T>(sobokuObj: { [K in keyof T]: Atom<T[K]> }): Calc<T>`

## LICENSE
MIT