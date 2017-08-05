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
function isSobokuReporter(x) {
    return typeof x === "object" && x instanceof SobokuReporterClass;
}
function isStateHolder(x) {
    return typeof x === "object" && typeof x.s === "function";
}
function isDepends(x) {
    return isSobokuReporter(x) && has(x, "depends");
}

class UnListenerClass {
    constructor(listeners, listener) {
        this.listeners = listeners;
        this.listener = listener;
    }
    unsubscribe() {
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
    report(listener, thisArg) {
        const _listener = new SobokuListenerClass(listener, thisArg);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }
    listenerCount() {
        return this.listeners.length;
    }
}
function reporter() {
    return new SobokuReporterClass();
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
function state(initial) {
    return new StateClass(initial);
}
function convAtomToStateHolder(atom) {
    if (isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}

class GateClass extends SobokuReporterClass {
    constructor(gatekeeper, reporter$$1) {
        super();
        this.gatekeeper = gatekeeper;
        reporter$$1.report(this.listener, this);
    }
    listener(val) {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    }
}
function gate(gatekeeper, reporter$$1) {
    return new GateClass(gatekeeper, reporter$$1);
}

class SobokuArrayClass extends SobokuReporterClass {
    constructor(array) {
        super();
        this.array = [];
        this.array = array || [];
    }
    s() {
        return this.array;
    }
    pop() {
        const result = this.array.pop();
        this.next(this.array);
        return result;
    }
    push() {
        const i = Array.prototype.push.apply(this.array, arguments);
        this.next(this.array);
        return i;
    }
    reverse() {
        this.array.reverse();
        this.next(this.array);
        return this.array;
    }
    shift() {
        const result = this.array.shift();
        this.next(this.array);
        return result;
    }
    sort(compareFn) {
        this.array.sort(compareFn);
        this.next(this.array);
        return this.array;
    }
    splice() {
        Array.prototype.splice.apply(this.array, arguments);
        this.next(this.array);
        return this.array;
    }
    unshift() {
        const result = Array.prototype.unshift.apply(this.array, arguments);
        this.next(this.array);
        return result;
    }
}
function sarray(array) {
    return new SobokuArrayClass(array);
}

function getDeps(atoms) {
    let result = [];
    for (let i = 0; atoms.length > i; ++i) {
        const atom = atoms[i];
        if (isDepends(atom)) {
            result = result.concat(atom.depends);
        }
        else if (isSobokuReporter(atom)) {
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
        const listener = this.listener;
        for (let i = 0; depends.length > i; ++i) {
            depends[i].report(listener, this);
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

class PublisherClass extends SobokuReporterClass {
    constructor(permition, reporter$$1) {
        super();
        this.permition = permition;
        this.reporter = reporter$$1;
        permition.report(this.permitionChanged, this);
        reporter$$1.report(this.publish, this);
    }
    s() {
        return this.reporter.s();
    }
    publish(val) {
        if (this.permition.s())
            this.next(val);
    }
    permitionChanged(permition) {
        if (permition)
            this.next(this.reporter.s());
    }
}
function publisher(permition, reporter$$1) {
    return new PublisherClass(permition, reporter$$1);
}

class SObservable {
    constructor() {
        this.output = new SobokuReporterClass();
    }
}

class TimerObservable extends SObservable {
    constructor(ms) {
        super();
        this.input = state(false);
        this.cb = () => this.output.next(Date.now());
        this.isRunning = false;
        const _ms = this.ms = convAtomToStateHolder(ms);
        this.input.report(this.fireTimer, this);
        if (isSobokuReporter(_ms))
            _ms.report(this.msChanged, this);
    }
    msChanged(ms) {
        if (this.isRunning) {
            this.fireTimer(false);
            this.fireTimer(true, ms);
        }
    }
    fireTimer(trigger, ms) {
        this.fire(trigger, ms || this.ms.s());
        this.isRunning = trigger;
    }
}
class IntervalObservable extends TimerObservable {
    fire(trigger, ms) {
        if (trigger === false) {
            clearInterval(this.timer);
        }
        else if (this.isRunning === false) {
            this.timer = setInterval(this.cb, ms);
        }
    }
}
class TimeoutObservable extends TimerObservable {
    fire(trigger, ms) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    }
}
function interval(ms) {
    return new IntervalObservable(ms);
}
function timeout(ms) {
    return new TimeoutObservable(ms);
}

function isEqual(x, y) {
    return x === y;
}
class SequenceEqualClass extends SObservable {
    constructor(sequence, compare = isEqual) {
        super();
        this.input = new SobokuReporterClass();
        this.i = 0;
        this.compare = compare;
        this.sequence = convAtomToStateHolder(sequence);
        this.input.report(this.checkInput, this);
    }
    checkInput(val) {
        const sequence = this.sequence.s();
        if (this.compare(sequence[this.i], val) === false) {
            this.i = 0;
            return;
        }
        if (++this.i === sequence.length) {
            this.i = 0;
            this.output.next(true);
        }
    }
}
function sequenceEqual(sequence, compareFunc) {
    return new SequenceEqualClass(sequence, compareFunc);
}

export { state, reporter, gate, sarray, combine, dependency, trigger, publisher, interval, timeout, sequenceEqual };
//# sourceMappingURL=soboku.mjs.map
