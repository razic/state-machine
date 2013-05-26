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
function StateMachine() {
}

/**
 * Prototype
 */
Object.defineProperty(StateMachine.prototype, "events", {
  get: function() {
    return this._events;
  },
  set: function(_events) {
    for (var name in _events) this[name] = createEventHandler.call(this, name);
    this._events = _events;
  }
});

StateMachine.prototype.transition = function(callback) {
  var state = this.state;

  loops:
    for (var name in this.events)
      for (var i = 0; i < this.events[name].length; i++)
        for (var ii = 0; ii < this.events[name][i].from.length; ii++)
          if (this.events[name][i].from[ii] === state)
            if (!!(this.state = this.events[name][i].to)) break loops;

  if (callback.call && state !== this.state)
    callback.call(this, state, this.state);
};

/**
 * Mixin
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
