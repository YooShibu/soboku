'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function optimizeCB(func) {
    switch (func.length) {
        case 1:
            return function (args) { return func(args[0]); };
        case 2:
            return function (args) { return func(args[0], args[1]); };
        case 3:
            return function (args) { return func(args[0], args[1], args[2]); };
        case 4:
            return function (args) { return func(args[0], args[1], args[2], args[3]); };
        default:
            return function (args) { return func.apply(undefined, args); };
    }
}
function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function unique(arr) {
    var result = [];
    for (var i = 0; arr.length > i; ++i) {
        var val = arr[i];
        if (indexOf(result, val) === -1) {
            result.push(val);
        }
    }
    return result;
}

function indexOf(arr, val) {
    for (var i = 0; arr.length > i; ++i) {
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
    for (var i = index, j = index + 1; arr.length > j; ++i, ++j) {
        arr[i] = arr[j];
    }
    arr.pop();
}
function map(arr, iteratee) {
    var result = [];
    for (var i = 0; arr.length > i; ++i) {
        result.push(iteratee(arr[i]));
    }
    return result;
}
function mapObj(obj, iteratee) {
    var result = {};
    for (var key in obj) {
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

var UnListenerClass = (function () {
    function UnListenerClass(listeners, listener) {
        this.listeners = listeners;
        this.listener = listener;
    }
    UnListenerClass.prototype.unsubscribe = function () {
        var listeners = this.listeners;
        if (listeners === null) {
            return;
        }
        var i = indexOf(listeners, this.listener);
        spliceOne(listeners, i);
        this.listeners = null;
        this.listener = null;
    };
    return UnListenerClass;
}());
var SobokuListenerClass = (function () {
    function SobokuListenerClass(listener, thisArg) {
        this.listener = listener;
        this.thisArg = thisArg;
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }
    SobokuListenerClass.prototype.gets = function (news) {
        this.listener.call(this.thisArg, news);
    };
    return SobokuListenerClass;
}());
var SobokuReporterClass = (function () {
    function SobokuReporterClass() {
        this.listeners = [];
    }
    SobokuReporterClass.prototype.next = function (val) {
        var listeners = this.listeners;
        for (var i = 0; listeners.length > i; ++i)
            listeners[i].gets(val);
        return val;
    };
    SobokuReporterClass.prototype.report = function (listener, thisArg) {
        var _listener = new SobokuListenerClass(listener, thisArg);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    };
    SobokuReporterClass.prototype.listenerCount = function () {
        return this.listeners.length;
    };
    return SobokuReporterClass;
}());
function reporter() {
    return new SobokuReporterClass();
}

var StateClass = (function (_super) {
    __extends(StateClass, _super);
    function StateClass(state) {
        var _this = _super.call(this) || this;
        _this.state = state;
        return _this;
    }
    StateClass.prototype.next = function (val) {
        this.state = val;
        return _super.prototype.next.call(this, val);
    };
    StateClass.prototype.s = function () {
        return this.state;
    };
    return StateClass;
}(SobokuReporterClass));
var StateHolderClass = (function () {
    function StateHolderClass(state) {
        this.state = state;
    }
    StateHolderClass.prototype.s = function () {
        return this.state;
    };
    return StateHolderClass;
}());
function state(initial) {
    return new StateClass(initial);
}
function convAtomToStateHolder(atom) {
    if (isStateHolder(atom)) {
        return atom;
    }
    return new StateHolderClass(atom);
}

var GateClass = (function (_super) {
    __extends(GateClass, _super);
    function GateClass(gatekeeper, reporter$$1) {
        var _this = _super.call(this) || this;
        _this.gatekeeper = gatekeeper;
        reporter$$1.report(_this.listener, _this);
        return _this;
    }
    GateClass.prototype.listener = function (val) {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    };
    return GateClass;
}(SobokuReporterClass));
function gate(gatekeeper, reporter$$1) {
    return new GateClass(gatekeeper, reporter$$1);
}

var SobokuArrayClass = (function (_super) {
    __extends(SobokuArrayClass, _super);
    function SobokuArrayClass(array) {
        var _this = _super.call(this) || this;
        _this.array = [];
        _this.array = array || [];
        return _this;
    }
    SobokuArrayClass.prototype.s = function () {
        return this.array;
    };
    SobokuArrayClass.prototype.pop = function () {
        var result = this.array.pop();
        this.next(this.array);
        return result;
    };
    SobokuArrayClass.prototype.push = function () {
        var i = Array.prototype.push.apply(this.array, arguments);
        this.next(this.array);
        return i;
    };
    SobokuArrayClass.prototype.reverse = function () {
        this.array.reverse();
        this.next(this.array);
        return this.array;
    };
    SobokuArrayClass.prototype.shift = function () {
        var result = this.array.shift();
        this.next(this.array);
        return result;
    };
    SobokuArrayClass.prototype.sort = function (compareFn) {
        this.array.sort(compareFn);
        this.next(this.array);
        return this.array;
    };
    SobokuArrayClass.prototype.splice = function () {
        Array.prototype.splice.apply(this.array, arguments);
        this.next(this.array);
        return this.array;
    };
    SobokuArrayClass.prototype.unshift = function () {
        var result = Array.prototype.unshift.apply(this.array, arguments);
        this.next(this.array);
        return result;
    };
    return SobokuArrayClass;
}(SobokuReporterClass));
function sarray(array) {
    return new SobokuArrayClass(array);
}

function getDeps(atoms) {
    var result = [];
    for (var i = 0; atoms.length > i; ++i) {
        var atom = atoms[i];
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
var CalcClass = (function (_super) {
    __extends(CalcClass, _super);
    function CalcClass(atoms) {
        var _this = _super.call(this) || this;
        var depends = _this.depends = getDeps(atoms);
        var listener = _this.listener;
        for (var i = 0; depends.length > i; ++i) {
            depends[i].report(listener, _this);
        }
        return _this;
    }
    CalcClass.prototype.listener = function (val) {
        this.next(this.s());
    };
    
    return CalcClass;
}(SobokuReporterClass));
var CalcFuncClass = (function (_super) {
    __extends(CalcFuncClass, _super);
    function CalcFuncClass(atoms, func) {
        var _this = _super.call(this, atoms) || this;
        _this.func = optimizeCB(func);
        _this.states = map(atoms, convAtomToStateHolder);
        return _this;
    }
    CalcFuncClass.prototype.s = function () {
        var args = map(this.states, getState);
        return this.func(args);
    };
    return CalcFuncClass;
}(CalcClass));

var CombineClass = (function (_super) {
    __extends(CombineClass, _super);
    function CombineClass(atomObj) {
        var _this = this;
        var atoms = [];
        for (var key in atomObj) {
            atoms.push(atomObj[key]);
        }
        _this = _super.call(this, atoms) || this;
        _this.shObj = mapObj(atomObj, convAtomToStateHolder);
        return _this;
    }
    CombineClass.prototype.s = function () {
        return mapObj(this.shObj, getState);
    };
    return CombineClass;
}(CalcClass));
function combine(atomObj) {
    return new CombineClass(atomObj);
}

var DependencyClass = (function (_super) {
    __extends(DependencyClass, _super);
    function DependencyClass(atoms, func) {
        return _super.call(this, atoms, func) || this;
    }
    return DependencyClass;
}(CalcFuncClass));
function dependency(func) {
    var atoms = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        atoms[_i - 1] = arguments[_i];
    }
    return new DependencyClass(atoms, func);
}

var TriggerClass = (function (_super) {
    __extends(TriggerClass, _super);
    function TriggerClass(atoms, func) {
        return _super.call(this, atoms, func) || this;
    }
    TriggerClass.prototype.listener = function () {
        var s = this.s();
        if (s)
            this.next(s);
    };
    return TriggerClass;
}(CalcFuncClass));
function trigger(func) {
    var atoms = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        atoms[_i - 1] = arguments[_i];
    }
    return new TriggerClass(atoms, func);
}

var PublisherClass = (function (_super) {
    __extends(PublisherClass, _super);
    function PublisherClass(permition, reporter$$1) {
        var _this = _super.call(this) || this;
        _this.permition = permition;
        _this.reporter = reporter$$1;
        permition.report(_this.permitionChanged, _this);
        reporter$$1.report(_this.publish, _this);
        return _this;
    }
    PublisherClass.prototype.s = function () {
        return this.reporter.s();
    };
    PublisherClass.prototype.publish = function (val) {
        if (this.permition.s())
            this.next(val);
    };
    PublisherClass.prototype.permitionChanged = function (permition) {
        if (permition)
            this.next(this.reporter.s());
    };
    return PublisherClass;
}(SobokuReporterClass));
function publisher(permition, reporter$$1) {
    return new PublisherClass(permition, reporter$$1);
}

var SObservable = (function () {
    function SObservable() {
        this.output = new SobokuReporterClass();
    }
    return SObservable;
}());

var TimerObservable = (function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(ms) {
        var _this = _super.call(this) || this;
        _this.input = state(false);
        _this.cb = function () { return _this.output.next(Date.now()); };
        _this.isRunning = false;
        var _ms = _this.ms = convAtomToStateHolder(ms);
        _this.input.report(_this.fireTimer, _this);
        if (isSobokuReporter(_ms))
            _ms.report(_this.msChanged, _this);
        return _this;
    }
    TimerObservable.prototype.msChanged = function (ms) {
        if (this.isRunning) {
            this.fireTimer(false);
            this.fireTimer(true, ms);
        }
    };
    TimerObservable.prototype.fireTimer = function (trigger, ms) {
        this.fire(trigger, ms || this.ms.s());
        this.isRunning = trigger;
    };
    return TimerObservable;
}(SObservable));
var IntervalObservable = (function (_super) {
    __extends(IntervalObservable, _super);
    function IntervalObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntervalObservable.prototype.fire = function (trigger, ms) {
        if (trigger === false) {
            clearInterval(this.timer);
        }
        else if (this.isRunning === false) {
            this.timer = setInterval(this.cb, ms);
        }
    };
    return IntervalObservable;
}(TimerObservable));
var TimeoutObservable = (function (_super) {
    __extends(TimeoutObservable, _super);
    function TimeoutObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeoutObservable.prototype.fire = function (trigger, ms) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    };
    return TimeoutObservable;
}(TimerObservable));
function interval(ms) {
    return new IntervalObservable(ms);
}
function timeout(ms) {
    return new TimeoutObservable(ms);
}

function isEqual(x, y) {
    return x === y;
}
var SequenceEqualClass = (function (_super) {
    __extends(SequenceEqualClass, _super);
    function SequenceEqualClass(sequence, compare) {
        if (compare === void 0) { compare = isEqual; }
        var _this = _super.call(this) || this;
        _this.input = new SobokuReporterClass();
        _this.i = 0;
        _this.compare = compare;
        _this.sequence = convAtomToStateHolder(sequence);
        _this.input.report(_this.checkInput, _this);
        return _this;
    }
    SequenceEqualClass.prototype.checkInput = function (val) {
        var sequence = this.sequence.s();
        if (this.compare(sequence[this.i], val) === false) {
            this.i = 0;
            return;
        }
        if (++this.i === sequence.length) {
            this.i = 0;
            this.output.next(true);
        }
    };
    return SequenceEqualClass;
}(SObservable));
function sequenceEqual(sequence, compareFunc) {
    return new SequenceEqualClass(sequence, compareFunc);
}

exports.state = state;
exports.reporter = reporter;
exports.gate = gate;
exports.sarray = sarray;
exports.combine = combine;
exports.dependency = dependency;
exports.trigger = trigger;
exports.publisher = publisher;
exports.interval = interval;
exports.timeout = timeout;
exports.sequenceEqual = sequenceEqual;
//# sourceMappingURL=soboku.js.map
