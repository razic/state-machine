# state-machine

> Simple finite-state machine.

> ![Dr. Seuss Machine](http://goo.gl/Nau11)

## Installation

```sh
component install razic/state-machine
```

## API

```javascript
var StateMachine = require('state-machine');

function Turnstile() {}

Turnstile.prototype.state = "locked"; // This is your initial state
Turnstile.prototype.pushes = 0;
Turnstile.prototype.coins = 0;

// Good
Turnstile.prototype.events = [
  { name: "push", from: "locked", to: "locked" },
  { name: "push", from: "unlocked", to: "locked" },
  { name: "coin", from: "locked", to: "unlocked" },
  { name: "coin", from: "unlocked", to: "unlocked" }
];

// Better
Turnstile.prototype.events = [
  { name: "push", from: ["locked", "unlocked"], to: "locked" },
  { name: "coin", from: ["locked", "unlocked"], to: "unlocked" },
];

// Best
Turnstile.prototype.events = [
  { name: "push", from: "unlocked", to: "locked" },
  { name: "coin", from: "locked", to: "unlocked" },
];

// Mixin the prototype
StateMachine(Turnstile.prototype);

// Declare the "push" event behavior
Turnstile.prototype.on("push", function() {
  this.transition(); // This actually transitions the state
  this.pushes += 1;
});

// Declare the "coin" event behavior
Turnstile.prototype.on("coin", function() {
  this.transition(); // This actually transitions the state
  this.coins += 1;
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
