# state-machine

> Simple finite-state machine.

> ![Dr. Seuss Machine](http://goo.gl/Nau11)

## Installation

```sh
component install razic/state-machine
```

## API

### StateMachine(object)

The `StateMachine` can be used as a mixin. For example, a "plain" object may also
become a state machine, or you may extend an existing prototype.

As a `StateMachine` instance:

```javascript
var StateMachine = require("state-machine");
var stateMachine = new StateMachine();

stateMachine.state = "off"
stateMachine.events = { "push": [
  { from: ["off"], to: "on" },
  { from: ["on"], to: "off" }
] };

stateMachine.push();
```

As a mixin:

```javascript
var StateMachine = require("state-machine");
var button = {
  state: "off",
  events: {
    "push": [
      { from: ["on"], to: "off" },
      { from: ["off"], to: "on" }
    ]
  }
};

StateMachine(button);

button.push();
```

As a prototype mixin:

```javascript
var StateMachine = require("state-machine");
var Button = function() {};

Button.prototype.state = "off";
Button.prototype.events = { push: [
  { from: ["off"], to: "on" }
  { from: ["on"], to: "off" }
] };

StateMachine(Button.prototype);

var button = new Button();

button.push();
```

### StateMachine#on(event, fn)

Register an `event` handler `fn`.

### StateMachine#transition(fn)

Transitions the state appropriately then calls `fn` passing two arguments, the
`from` state and `to` state.

### StateMachine#event(...)

Where `#event` is one of the declared events. These methods get dynamically
created after setting the `events` property.

## Example

```javascript
var StateMachine = require('state-machine');

function Turnstile() {}

Turnstile.prototype.state = "locked"; // This is your initial state
Turnstile.prototype.pushes = 0;
Turnstile.prototype.coins = 0;

// Define the events
Turnstile.prototype.events = {
  "push": [{ from: ["locked", "unlocked"], to: "locked" }],
  "coin": [{ from: ["locked", "unlocked"], to: "unlocked" }]
};

// Mixin the prototype
StateMachine(Turnstile.prototype);

// Declare the "push" event behavior
Turnstile.prototype.on("push", function() {
  this.transition(function() {
    this.pushes += 1;
  });
});

// Declare the "coin" event behavior
Turnstile.prototype.on("coin", function() {
  this.transition(function() {
    this.coins += 1;
  });
});

// Create your object
var turnstile = new Turnstile();

// Play with it
turnstile.state;       // Returns "locked"
turnstile.can("push"); // Returns false
turnstile.can("coin"); // Returns true
turnstile.push();      // Emits the "push" event
turnstile.state;       // Returns "locked"
turnstile.can("push"); // Returns false
turnstile.can("coin"); // Returns true
turnstile.coin();      // Emits the "coin" event
turnstile.state;       // Returns "unlocked"
turnstile.can("coin"); // Returns true
turnstile.can("push"); // Returns true
turnstile.coin();      // Emits the "coin" event
turnstile.state;       // Returns "unlocked"
turnstile.can("coin"); // Returns true
turnstile.can("push"); // Returns true
turnstile.push();      // Emits the "push" event
turnstile.state;       // Returns "locked"
turnstile.can("coin"); // Returns true
turnstile.can("push"); // Returns false
turnstile.coins        // Returns 2
turnstile.pushes       // Returns 1
```

## License

MIT
