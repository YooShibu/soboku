'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function optimizeCB(func) {
    switch (func.length) {
        case 1:
            return (args) => func(args[0]);
        case 2:
            return (args) => func(args[0], args[1]);
        case 3:
            return (args) => func(args[0], args[1], args[2]);
        case 4:
            return (args) => func(args[0], args[1], args[2], args[3]);
        default:
            return (args) => func.apply(undefined, args);
    }
}
function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function unique(arr) {
    const result = [];
    for (let i = 0; arr.length > i; ++i) {
        const val = arr[i];
        if (indexOf(result, val) === -1) {
            result.push(val);
        }
    }
    return result;
}

function indexOf(arr, val) {
    for (let i = 0; arr.length > i; ++i) {
        if (arr[i] === val) {
            return i;
        }
    }
    return -1;
}
function spliceOne(arr, index) {
    if (0 > index) {
        return;
    }
    for (let i = index, j = index + 1; arr.length > j; ++i, ++j) {
        arr[i] = arr[j];
    }
    arr.pop();
}
function map(arr, iteratee) {
    const result = [];
    for (let i = 0; arr.length > i; ++i) {
        result.push(iteratee(arr[i]));
    }
    return result;
}
function mapObj(obj, iteratee) {
    const result = {};
    for (let key in obj) {
        result[key] = iteratee(obj[key]);
    }
    return result;
}
function isSobokuEvent(x) {
    return typeof x === "object" && x instanceof SobokuReporterClass;
}
function isStateHolder(x) {
    return typeof x === "object" && typeof x.s === "function";
}
function isDepends(x) {
    return isSobokuEvent(x) && has(x, "depends");
}
function isSobokuListener(x) {
    return x instanceof SobokuListenerClass;
}

class UnListenerClass {
    constructor(listeners, listener) {
        this.listeners = listeners;
        this.listener = listener;
    }
    unlisten() {
        const listeners = this.listeners;
        if (listeners === null) {
            return;
        }
        const i = indexOf(listeners, this.listener);
        spliceOne(listeners, i);
        this.listeners = null;
        this.listener = null;
    }
}
class SobokuListenerClass {
    constructor(listener, thisArg) {
        this.listener = listener;
        this.thisArg = thisArg;
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }
    gets(news) {
        this.listener.call(this.thisArg, news);
    }
}
function listener(cb, thisArg) {
    return new SobokuListenerClass(cb, thisArg);
}
class SobokuReporterClass {
    constructor() {
        this.listeners = [];
    }
    next(val) {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i)
            listeners[i].gets(val);
        return val;
    }
    report(listener) {
        const _listener = isSobokuListener(listener)
            ? listener
            : new SobokuListenerClass(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }
    listenerCount() {
        return this.listeners.length;
    }
}

class StateClass extends SobokuReporterClass {
    constructor(state) {
        super();
        this.state = state;
    }
    next(val) {
        this.state = val;
        return super.next(val);
    }
    s() {
        return this.state;
    }
}
class StateHolderClass {
    constructor(state) {
        this.state = state;
    }
    s() {
        return this.state;
    }
}
class GateClass extends SobokuReporterClass {
    constructor(gatekeeper, reporter) {
        super();
        this.gatekeeper = gatekeeper;
        reporter.report(new SobokuListenerClass(this.listener, this));
    }
    listener(val) {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    }
}
class SobokuArrayClass extends Array {
    constructor() {
        super(...arguments);
        this.r = new SobokuReporterClass();
    }
    s() {
        return this;
    }
    pop() {
        const result = super.pop();
        this.r.next(this);
        return result;
    }
    push() {
        const i = super.push.apply(this, arguments);
        this.r.next(this);
        return i;
    }
    reverse() {
        super.reverse();
        this.r.next(this);
        return this;
    }
    shift() {
        const result = super.shift();
        this.r.next(this);
        return result;
    }
    sort(compareFn) {
        super.sort(compareFn);
        this.r.next(this);
        return this;
    }
    splice() {
        super.splice.apply(this, arguments);
        this.r.next(this);
        return this;
    }
    unshift() {
        const result = super.unshift.apply(this, arguments);
        this.r.next(this);
        return result;
    }
}
function reporter() {
    return new SobokuReporterClass();
}
function state(initial) {
    return new StateClass(initial);
}
function gate(gatekeeper, reporter) {
    return new GateClass(gatekeeper, reporter);
}
function sarray(array) {
    if (array == undefined)
        return new SobokuArrayClass();
    return new SobokuArrayClass().concat(array);
}
function convAtomToStateHolder(atom) {
    if (isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}

function getDeps(atoms) {
    let result = [];
    for (let i = 0; atoms.length > i; ++i) {
        const atom = atoms[i];
        if (isDepends(atom)) {
            result = result.concat(atom.depends);
        }
        else if (isSobokuEvent(atom)) {
            result.push(atom);
        }
    }
    return unique(result);
}
function getState(sh) {
    return sh.s();
}
class CalcClass extends SobokuReporterClass {
    constructor(atoms) {
        super();
        const depends = this.depends = getDeps(atoms);
        const listener$$1 = new SobokuListenerClass(this.listener, this);
        for (let i = 0; depends.length > i; ++i) {
            depends[i].report(listener$$1);
        }
    }
    listener(val) {
        this.next(this.s());
    }
    ;
}
class CalcFuncClass extends CalcClass {
    constructor(atoms, func) {
        super(atoms);
        this.func = optimizeCB(func);
        this.states = map(atoms, convAtomToStateHolder);
    }
    s() {
        const args = map(this.states, getState);
        return this.func(args);
    }
}

class CombineClass extends CalcClass {
    constructor(atomObj) {
        const atoms = [];
        for (let key in atomObj) {
            atoms.push(atomObj[key]);
        }
        super(atoms);
        this.shObj = mapObj(atomObj, convAtomToStateHolder);
    }
    s() {
        return mapObj(this.shObj, getState);
    }
}
function combine(atomObj) {
    return new CombineClass(atomObj);
}

class DependencyClass extends CalcFuncClass {
    constructor(atoms, func) {
        super(atoms, func);
    }
}
function dependency(func, ...atoms) {
    return new DependencyClass(atoms, func);
}

class TriggerClass extends CalcFuncClass {
    constructor(atoms, func) {
        super(atoms, func);
    }
    listener() {
        const s = this.s();
        if (s)
            this.next(s);
    }
}
function trigger(func, ...atoms) {
    return new TriggerClass(atoms, func);
}

class UnhandledObservableError extends Error {
    constructor(err) {
        super(`Unhandled observable error: ${err.name}: ${err.message}`);
    }
}
UnhandledObservableError.prototype.name = "UnhandledObservableError";

class TimerObservable {
    constructor(ms) {
        this.input = reporter();
        this.output = reporter();
        this.cb = () => this.output.next(Date.now());
        this.isEmitting = false;
        const _ms = this.ms = convAtomToStateHolder(ms);
        this.input.report(new SobokuListenerClass(this.fireTimer, this));
        if (isSobokuEvent(_ms))
            _ms.report(new SobokuListenerClass(this.msChanged, this));
    }
    msChanged(ms) {
        if (this.isEmitting) {
            this.fireTimer(false);
            this.fireTimer(true, ms);
        }
    }
    fireTimer(trigger, ms) {
        this.fire(trigger, ms || this.ms.s());
        this.isEmitting = trigger;
    }
}
class IntervalObservable extends TimerObservable {
    fire(trigger, ms) {
        if (trigger === false) {
            clearInterval(this.timer);
        }
        else if (this.isEmitting === false) {
            this.timer = setInterval(this.cb, ms);
        }
    }
}
function interval(ms) {
    return new IntervalObservable(ms);
}

exports.gate = gate;
exports.reporter = reporter;
exports.sarray = sarray;
exports.state = state;
exports.listener = listener;
exports.combine = combine;
exports.dependency = dependency;
exports.trigger = trigger;
exports.UnhandledObservableError = UnhandledObservableError;
exports.interval = interval;
//# sourceMappingURL=soboku.js.map
