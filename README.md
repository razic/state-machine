# state-machine

> Simple finite-state machine.

![Dr. Seuss Machine](http://goo.gl/Nau11)

## Installation

```sh
component install razic/state-machine
```

## API

```javascript
var StateMachine = require('state-machine');

function Turnstile() {
}

StateMachine(Turnstile.prototype);

Turnstile.prototype.state = "locked";
Turnstile.prototype.states = ["locked", "unlocked"];
Turnstile.prototype.events = ["coin", "push"];

Turnstile.prototype.on("coin", function() {
  this.state = "unlocked";
});

Turnstile.prototype.on("push", function() {
  this.state = "locked";
});


var turnstile = new Turnstile();

// Returns "locked"
turnstile.state;

// Returns false
turnstile.can("push");

// Returns true
turnstile.can("coin");

// Emits the "push" event
turnstile.push();

// Returns "locked"
turnstile.state

// Returns true
turnstile.can("coin");

// Returns false
turnstile.can("push");

// Emits the "coin" event
turnstile.coin();

// Returns "unlocked"
turnstile.state

// Returns true
turnstile.can("coin");

// Returns true
turnstile.can("push);

// Emits the "coin" event
turnstile.coin();

// Returns "unlocked"
turnstile.state

// Returns true
turnstile.can("coin");

// Returns true
turnstile.can("push);

// Emits the "push" event
turnstile.push();

// Returns "locked"
turnstile.state

// Returns true
turnstile.can("coin");

// Returns false
turnstile.can("push);
```

## License

MIT
