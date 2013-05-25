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

Turnstile.prototype.state = "locked";

Turnstile.prototype.events = {
  "push": { from: ["locked", "unlocked"], to: "locked" },
  "coin": { from: ["locked", "unlocked"], to: "unlocked" }
};

StateMachine(Turnstile.prototype);

Turnstile.prototype.on("push", function() {
  this.transition();
});

Turnstile.prototype.on("coin", function() {
  this.transition();
});

var turnstile = new Turnstile();

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
turnstile.can("push);  // Returns true
turnstile.coin();      // Emits the "coin" event
turnstile.state;       // Returns "unlocked"
turnstile.can("coin"); // Returns true
turnstile.can("push);  // Returns true
turnstile.push();      // Emits the "push" event
turnstile.state;       // Returns "locked"
turnstile.can("coin"); // Returns true
turnstile.can("push);  // Returns false
```

## License

MIT
