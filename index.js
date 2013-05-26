/**
 * Dependencies
 */
var Emitter = require('emitter');

/**
 * Expose
 */
module.exports = StateMachine;


/**
 * Constructor
 */
function StateMachine(object) {
  if (object) return mixin(object);
}

/**
 * Prototype
 */
Object.defineProperty(StateMachine.prototype, "events", {
  get: getEvents,
  set: setEvents
});

StateMachine.prototype.transition = function(fn) {
  var state = this.state, to;
  for (var name in this.events) this.state = this.can(name, true);
  if (fn.call && state !== this.state) fn.call(this, state, this.state);
};

StateMachine.prototype.can = function(name, to) {
  for (var i = 0; i < this.events[name].length; i++)
    for (var ii = 0; ii < this.events[name][i].from.length; ii++)
      if (this.events[name][i].from[ii] === this.state)
        return to ? this.events[name][i].to : true;

  return to ? this.state : false;
};

/**
 * Mixins
 */
Emitter(StateMachine.prototype);

/**
 * Helpers
 */
function createEventHandler(name) {
  return function() {
    this.emit.apply(this, [name].concat([].slice.call(arguments, 0)));
  };
}

function mixin(object) {
  for (var key in StateMachine.prototype)
    object[key] = StateMachine.prototype[key];

  if (object.events) setEvents.call(object, object.events);

  return object;
}

function getEvents() {
  return this._events;
}

function setEvents(_events) {
  for (var name in _events) this[name] = createEventHandler.call(this, name);
  this._events = _events;
}
