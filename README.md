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

~~~ typescript
import { state, editer, combine } from "soboku"

const first = state(""),
      last = state(""),
      full = editer((f: string, l: string) => `${f} ${l}`.trim(), [first, last]),
      name = combine({ first, last, full });

full.report(console.log);
name.report(console.log);

console.log(name.s()) // { first: "", last: "", full: "" }

first.next("Napoléon");
// Napoléon
// { first: "Napoléon", last: "", full: "Napoléon" }

last.next("Bonaparte");
// Napoléon Bonaparte
// { first: "Napoléon", last: "Bonaparte", full: "Napoléon Bonaparte" }
~~~


## Libraries
- [soboku-observable](https://github.com/YooShibu/soboku-observable)


## API

### Reporter

#### `reporter<T>(): Reporter<T>`

~~~ typescript
import { reporter } from "soboku"

const message = reporter<string>();
message.report(console.log);
message.next("Hello soboku");

// console
// Hello soboku
~~~

#### `listener<T>(func: Listener<T>, thisArg?: any): IListener<T>`

#### `gate<T> gate<T>(gatekeeper: IStateHolder<boolean>, reporter: IReporter<T>): IReporter<T>`

~~~ typescript
import { gate, reporter, state } from "soboku"

const done = state(false);
const _message = reporter<string>();
const message = gate(done, _message);
message.report(console.log);

_message.next("Hello");
done.next(true);
_message.next("Bye");

// console
// Bye
~~~

### State

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


#### `editer<T>(func: (...atoms: Atom<any>[]) => T, atoms: Atom<any>[]): Calc<T>`

~~~ typescript
import { state, editer } from "soboku"

function twice(num: number): number {
    return num * 2;
}

function add(num1: number, num2: number): number {
    return num1 + num2;
}

const x = state(10);
const y = editer(twice, [x]);
const z = editer(add, [x, y]);
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

#### `trigger(conditon: Calc<boolean>): Calc<boolean>`

~~~ typescript
import { state, trigger } from "soboku"

const complete = state(false);
const isDone = trigger(complete);
console.log(isDone.s()) // false

isDone.report(console.log);

count.next(false);
count.next(false);
count.next(true);
// console
// true
~~~

#### `ntrigger(conditon: Calc<boolean>): Calc<boolean>`

~~~ typescript
import { state, ntrigger } from "soboku"

const complete = state(false);
const isDone = ntrigger(complete);
console.log(isDone.s()) // true

isDone.report(console.log);

count.next(true);
count.next(true);
count.next(false);
// console
// true
~~~

### Class

#### `ReporterClass<T> implements IReporter<T>, IProgressable<T>`
<dl>
    <dt>method</dt>
    <dd>
        <ul>
            <li>public next(val: T): T</li>
            <li>public listenerCount(): number</li>
            <li>public report(listener: Listener<T> | IListener<T>): IUnsubscriber</li>
        </ul>
    </dd>
</dl>

### Types

#### `Atom<T>`
T | StateHolder\<T>

#### `Calc<T>`
IReporter\<T> & IStateHolder\<T>

#### `Listener<T>`
(val: T) => void;

#### `Reporter<T>`
IReporter\<T> & IProgressable\<T>

#### `State<T>`
IReporter\<T> & IProgressabel\<T> & IStateHolder\<T>


### Interfaces

#### `IListener<T>`
- read(val: T) => void

#### `IProgressable<T>`
- next(val: T): T

#### `IReporter<T>`
- report(listener: Listener\<T> | IListener\<T>): Unsubscriber
- listenerCount(): number

#### `IUnsubscriber`
- unsubscribe: () => void

#### `IStateHolder<T>`
- s(): T

#### `ISArray<T> extends IReporter<T[]> implements IStateHolder<T>`
- s(): T[];
- pop(): T | undefined;
- push(...items: T[]): number;
- reverse(): T[];
- shift(): T | undefined;
- sort(compareFn?: (a: T, b: T) => number): T[];
- splice(start: number, deleteCount?: number): T[];
- splice(start: number, deleteCount: number, ...items: T[]): T[];
- unshift(...items: T[]): number;

#### `ISObservable<I, O, T extends Reporter<I>>`
- readonly input: T
- readonly error: IReporter\<Error>
- readonly output: IReporter\<O>
- readonly reset: IReporter\<true>

## LICENSE
MIT