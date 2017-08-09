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
    return typeof x === "object" && x instanceof ReporterClass;
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
    read(news) {
        this.listener.call(this.thisArg, news);
    }
}
class ReporterClass {
    constructor() {
        this.listeners = [];
    }
    next(val) {
        const listeners = this.listeners;
        for (let i = 0; listeners.length > i; ++i)
            listeners[i].read(val);
        return val;
    }
    report(listener) {
        const _listener = listener instanceof SobokuListenerClass
            ? listener
            : new SobokuListenerClass(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    }
    listenerCount() {
        return this.listeners.length;
    }
}
function reporter() {
    return new ReporterClass();
}
function listener(listener, thisArg) {
    return new SobokuListenerClass(listener, thisArg);
}

class StateClass extends ReporterClass {
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

class GateClass extends ReporterClass {
    constructor(gatekeeper, reporter$$1) {
        super();
        this.gatekeeper = gatekeeper;
        reporter$$1.report(new SobokuListenerClass(this.listener, this));
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

class SobokuArrayClass extends ReporterClass {
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
class CalcClass extends ReporterClass {
    constructor() {
        super(...arguments);
        this.depends = [];
    }
    addDepends(atoms, listener$$1) {
        const depends = getDeps(atoms);
        for (let i = 0; depends.length > i; ++i) {
            depends[i].report(listener$$1);
        }
        this.depends.push.apply(this.depends, depends);
    }
    listener(val) {
        this.next(this.s());
    }
    ;
}

class CombineClass extends CalcClass {
    constructor(atomObj) {
        super();
        const atoms = [];
        for (let key in atomObj) {
            atoms.push(atomObj[key]);
        }
        super.addDepends(atoms, new SobokuListenerClass(this.listener, this));
        this.shObj = mapObj(atomObj, convAtomToStateHolder);
    }
    s() {
        return mapObj(this.shObj, getState);
    }
}
function combine(atomObj) {
    return new CombineClass(atomObj);
}

class EditerClass extends CalcClass {
    constructor(func, atoms) {
        super();
        this.func = optimizeCB(func);
        this.states = map(atoms, convAtomToStateHolder);
        super.addDepends(atoms, new SobokuListenerClass(this.listener, this));
    }
    s() {
        const args = map(this.states, getState);
        return this.func(args);
    }
}
function editer(func, atoms) {
    return new EditerClass(func, atoms);
}

class TriggerClass extends CalcClass {
    constructor(condition) {
        super();
        this.condition = condition;
        const listener$$1 = new SobokuListenerClass(this.onConditionChanged, this);
        super.addDepends([condition], listener$$1);
    }
    onConditionChanged() {
        const s = this.s();
        if (s)
            this.next(s);
    }
    s() {
        return this.condition.s();
    }
}
class NTriggerClass extends TriggerClass {
    s() {
        return !super.s();
    }
}
function trigger(condition) {
    return new TriggerClass(condition);
}
function ntrigger(condition) {
    return new NTriggerClass(condition);
}

class PublisherClass extends CalcClass {
    constructor(permition, reporter$$1) {
        super();
        this.permition = permition;
        this.reporter = reporter$$1;
        this.prevPermition = permition.s();
        super.addDepends([permition], new SobokuListenerClass(this.permitionChanged, this));
        super.addDepends([reporter$$1], new SobokuListenerClass(this.publish, this));
    }
    s() {
        return this.reporter.s();
    }
    publish() {
        if (this.permition.s()) {
            this.next(this.reporter.s());
        }
    }
    permitionChanged() {
        const permition = this.permition.s();
        if (permition && this.prevPermition === false) {
            this.next(this.reporter.s());
        }
        this.prevPermition = permition;
    }
}
function publisher(permition, reporter$$1) {
    return new PublisherClass(permition, reporter$$1);
}

export { state, listener, reporter, ReporterClass, gate, sarray, combine, editer, trigger, ntrigger, publisher };
//# sourceMappingURL=soboku.mjs.map
