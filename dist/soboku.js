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
    return typeof x === "object" && x instanceof ReporterClass;
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
var ListenerClass = (function () {
    function ListenerClass(listener, thisArg) {
        this.listener = listener;
        this.thisArg = thisArg;
        if (typeof listener !== "function") {
            throw new TypeError("'listener' must be a function");
        }
    }
    ListenerClass.prototype.read = function (news) {
        this.listener.call(this.thisArg, news);
    };
    return ListenerClass;
}());
var ListenerOnceClass = (function () {
    function ListenerOnceClass(listener) {
        this.listener = listener;
    }
    ListenerOnceClass.prototype.read = function (news) {
        this.listener.read(news);
        this.unsubscriber.unsubscribe();
    };
    return ListenerOnceClass;
}());
var ReporterClass = (function () {
    function ReporterClass() {
        this.listeners = [];
    }
    ReporterClass.prototype.next = function (val) {
        var listeners = this.listeners;
        for (var i = 0; listeners.length > i; ++i) {
            listeners[i].read(val);
        }
        return val;
    };
    ReporterClass.prototype.report = function (listener) {
        var _listener = toListener(listener);
        this.listeners.push(_listener);
        return new UnListenerClass(this.listeners, _listener);
    };
    ReporterClass.prototype.reportOnce = function (listener) {
        var _listener = new ListenerOnceClass(toListener(listener));
        this.listeners.push(_listener);
        return _listener.unsubscriber = new UnListenerClass(this.listeners, _listener);
    };
    ReporterClass.prototype.listenerCount = function () {
        return this.listeners.length;
    };
    return ReporterClass;
}());
function toListener(listener) {
    return listener instanceof ListenerClass
        ? listener
        : new ListenerClass(listener);
}
function reporter() {
    return new ReporterClass();
}
function listener(listener, thisArg) {
    return new ListenerClass(listener, thisArg);
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
}(ReporterClass));
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
function toStateHolder(atom) {
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
        reporter$$1.report(new ListenerClass(_this.listener, _this));
        return _this;
    }
    GateClass.prototype.listener = function (val) {
        if (this.gatekeeper.s()) {
            this.next(val);
        }
    };
    return GateClass;
}(ReporterClass));
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
}(ReporterClass));
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
    function CalcClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.depends = [];
        return _this;
    }
    CalcClass.prototype.addDepends = function (atoms, listener$$1) {
        var depends = getDeps(atoms);
        for (var i = 0; depends.length > i; ++i) {
            depends[i].report(listener$$1);
        }
        this.depends.push.apply(this.depends, depends);
    };
    CalcClass.prototype.listener = function (val) {
        this.next(this.s());
    };
    
    return CalcClass;
}(ReporterClass));

var CombineClass = (function (_super) {
    __extends(CombineClass, _super);
    function CombineClass(atomObj) {
        var _this = _super.call(this) || this;
        var atoms = [];
        for (var key in atomObj) {
            atoms.push(atomObj[key]);
        }
        _super.prototype.addDepends.call(_this, atoms, new ListenerClass(_this.listener, _this));
        _this.shObj = mapObj(atomObj, toStateHolder);
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

var EditerClass = (function (_super) {
    __extends(EditerClass, _super);
    function EditerClass(func, atoms) {
        var _this = _super.call(this) || this;
        _this.func = optimizeCB(func);
        _this.states = map(atoms, toStateHolder);
        _super.prototype.addDepends.call(_this, atoms, new ListenerClass(_this.listener, _this));
        return _this;
    }
    EditerClass.prototype.s = function () {
        var args = map(this.states, getState);
        return this.func(args);
    };
    return EditerClass;
}(CalcClass));
function editer(func, atoms) {
    return new EditerClass(func, atoms);
}

var TriggerClass = (function (_super) {
    __extends(TriggerClass, _super);
    function TriggerClass(condition) {
        var _this = _super.call(this) || this;
        _this.condition = condition;
        var listener$$1 = new ListenerClass(_this.onConditionChanged, _this);
        _super.prototype.addDepends.call(_this, [condition], listener$$1);
        return _this;
    }
    TriggerClass.prototype.onConditionChanged = function () {
        var s = this.s();
        if (s)
            this.next(s);
    };
    TriggerClass.prototype.s = function () {
        return this.condition.s();
    };
    return TriggerClass;
}(CalcClass));
var NTriggerClass = (function (_super) {
    __extends(NTriggerClass, _super);
    function NTriggerClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NTriggerClass.prototype.s = function () {
        return !_super.prototype.s.call(this);
    };
    return NTriggerClass;
}(TriggerClass));
function trigger(condition) {
    return new TriggerClass(condition);
}
function ntrigger(condition) {
    return new NTriggerClass(condition);
}

var PublisherClass = (function (_super) {
    __extends(PublisherClass, _super);
    function PublisherClass(permition, reporter$$1) {
        var _this = _super.call(this) || this;
        _this.permition = permition;
        _this.reporter = reporter$$1;
        _this.prevPermition = permition.s();
        _super.prototype.addDepends.call(_this, [permition], new ListenerClass(_this.permitionChanged, _this));
        _super.prototype.addDepends.call(_this, [reporter$$1], new ListenerClass(_this.publish, _this));
        return _this;
    }
    PublisherClass.prototype.s = function () {
        return this.reporter.s();
    };
    PublisherClass.prototype.publish = function () {
        if (this.permition.s()) {
            this.next(this.reporter.s());
        }
    };
    PublisherClass.prototype.permitionChanged = function () {
        var permition = this.permition.s();
        if (permition && this.prevPermition === false) {
            this.next(this.reporter.s());
        }
        this.prevPermition = permition;
    };
    return PublisherClass;
}(CalcClass));
function publisher(permition, reporter$$1) {
    return new PublisherClass(permition, reporter$$1);
}

exports.state = state;
exports.toStateHolder = toStateHolder;
exports.listener = listener;
exports.reporter = reporter;
exports.ReporterClass = ReporterClass;
exports.gate = gate;
exports.sarray = sarray;
exports.combine = combine;
exports.editer = editer;
exports.trigger = trigger;
exports.ntrigger = ntrigger;
exports.publisher = publisher;
//# sourceMappingURL=soboku.js.map
