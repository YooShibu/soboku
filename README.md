[![Build Status](https://travis-ci.org/YooShibu/soboku.svg?branch=master)](https://travis-ci.org/YooShibu/soboku)
[![codecov](https://codecov.io/gh/YooShibu/soboku/branch/master/graph/badge.svg)](https://codecov.io/gh/YooShibu/soboku)
[![gzip size](http://img.badgesize.io/https://unpkg.com/soboku/dist/soboku.min.js?compression=gzip)](https://unpkg.com/soboku/dist/soboku.min.js)


# soboku

A tiny javascript package for reactive programming. Reduce global mutable flags and if-else statement from your code.

## How to use
Node.js

    npm install soboku

Browser
~~~ html
<script src="https://unpkg.com/soboku/dist/soboku.min.js"></script>
<script>
    // soboku in global
    const { state } = soboku;
</script>
~~~
## Example

A countdown timer

~~~ typescript
import { state, gate, dependency, trigger, interval } from "soboku"


// -----------------------------------------
// Prepere countdown timer
// -----------------------------------------

function isZero(x: number): boolean {
    return x === 0;
}

function isGreaterThan0(x: number): boolean {
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

### Functions

#### `reporter<T>(): Reporter<T>`

~~~ typescript
import { reporter } from "soboku"

const message = reporter<string>();
message.report(console.log);
message.next("Hello soboku");

// console
// Hello soboku
~~~

#### `state<T>(initial: T): State<T>`

~~~ typescript
import { state } from "soboku"

const count = state(0);
console.log(count.s()); // 0

count.report(console.log);
count.next(100);
// console
// 100

console.log(count.s()) // 100
~~~

#### `sarray<T>(initial?: T[]): ISArray<T>`

~~~ typescript
import { sarray } from "soboku"

const nums = sarray([1, 2, 3]);
console.log(nums.s()) // [1, 2, 3]

nums.report(console.log);

nums.push(4);
// console
// [1, 2, 3, 4]
~~~


#### `dependency<T>(func: (...atoms: Atom<any>[]) => T, ...atoms: Atom<any>[]): Calc<T>`

~~~ typescript
import { state, dependency } from "soboku"

function twice(num: number): number {
    return num * 2;
}

function add(num1: number, num2: number): number {
    return num1 + num2;
}

const x = state(10);
const y = dependency(twice, x);
const z = dependency(add, x, y);
console.log(z.s()) // 30

z.report(console.log);

x.next(52);
// console
// 156
~~~

#### `combine<T>(sobokuObj: { [K in keyof T]: Atom<T[K]> }): Calc<T>`

~~~ typescript
import { state, combine } from "soboku"

const x = state(10);
const y = state(2);
const point = combine({ x, y, z: 20 });
console.log(point.s()) // { x: 10, y: 2, z: 20 }

point.report(console.log);

y.next(100);
// console
// { x: 10, y: 100, z: 20 }

~~~

#### `publisher(permition: IReporter<boolean>, reporter: Calc<T>): Calc<T>`

~~~ typescript
import { state, publisher } from "soboku"

const complete = state(false);
const source = state(10);
const num = publisher(complete, source);
console.log(num.s()) // 10

num.report(console.log);

source.next(100);
source.next(20);
complete.next(true); // permition turns true then report num
// 20
source.next(2);
// 2
~~~

#### `trigger(predicate: (...atoms: Atom<any>[]), ...atoms<any>[]): Calc<boolean>`

~~~ typescript
import { state, trigger } from "soboku"

function isGreaterThan10(x: number): boolean {
    return x > 10;
}

const count = state(0);
const isDone = trigger(isGreaterThan10, count);
console.log(isDone.s()) // false

isDone.report(console.log);

count.next(2);
count.next(8);
count.next(15);
// console
// true
~~~

#### `interval(ms: Atom<number>): ISObservable<State<boolean>, number>`
~~~ typescript
import { interval } from "soboku"

function showLocaleTime(now: number): void {
    console.log(new Date(now).toLocaleTimeString());
}

const timer = interval(1000);
interval.output.report(showLocaleTime);

timer.input.next(true);
// ...1s later
// 21:44:58
// 21:44:59
// ... forever
~~~

#### `timeout(ms: Atom<number>): ISObservable<State<boolean>, number>`
~~~ typescript
import { timeout } from "soboku"

function done() {
    console.log("done");
}

const timer1 = timeout(1000);
const timer2 = timeout(500);
timer1.output.report(done);
// .5sec later. Restart timer1
timer2.output.report(() => timer1.input.next(true));

timer1.input.next(true);
timer2.input.next(true);

// console 1.5sec later
// done
~~~

#### `sequenceEqual<T>(sequence: T[] | ISArray<T>, compareFn?: (x: T, y: T) => boolean): ISObservalbe<Reporter<T>, true>`
~~~ typescript
import { sequenceEqual } from "soboku"

const isOKinputed = sequenceEqual(["O", "K"]);
sequenceEqual.output.report(console.log);

sequenceEqual.input.next("N");
sequenceEqual.input.next("O");
sequenceEqual.input.next("K");
// console
// true
~~~


### Types

#### `Atom<T>`
T | StateHolder\<T>

#### `Calc<T>`
IReporter\<T> & IStateHolder\<T>

#### `Reporter<T>`
IReporter\<T> & IProgressable\<T>

#### `State<T>`
IReporter\<T> & IProgressabel\<T> & IStateHolder\<T>


### Interfaces

#### `IProgressable<T>`
- next(val: T): T

#### `IReporter<T>`

- report(listener: (val: T) => void): Unsubscriber

- listenerCount(): number

#### `IUnsubscriber`
- unsubscribe: () => void

#### `IStateHolder<T>`
- s(): T

#### `ISobokuArray<T> extends IReporter<T[]> implements IStateHolder<T>`
- s(): T[];
- pop(): T | undefined;
- push(...items: T[]): number;
- reverse(): T[];
- shift(): T | undefined;
- sort(compareFn?: (a: T, b: T) => number): T[];
- splice(start: number, deleteCount?: number): T[];
- splice(start: number, deleteCount: number, ...items: T[]): T[];
- unshift(...items: T[]): number;

#### `ISObservable<I extends Reporter<any>, O>`
- readonly input: I
- readonly output: IReporter\<O>

## LICENSE
MIT