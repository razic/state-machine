var assert = require('assert'),
    StateMachine = require('state-machine');

describe('StateMachine', function() {
  var stateMachine,
      eventHandlerContext,
      eventHandlerArguments,
      transitionArguments;

  beforeEach(function() {
    eventHandlerContext = null;
    eventHandlerArguments = null;
    transitionArguments = null;
    stateMachine = new StateMachine();
    stateMachine.pushes = 0;
    stateMachine.coins = 0;
    stateMachine.state = "locked";
    stateMachine.events = {
      push: [{ from: ["unlocked"], to: "locked"  }],
      coin: [{ from: ["locked", "unlocked"], to: "unlocked" }]
    };
    stateMachine.on("push", function() {
      eventHandlerContext = this;
      eventHandlerArguments = arguments;

      this.transition(function() {
        transitionArguments = arguments;
        this.pushes += 1;
      });
    });
    stateMachine.on("coin", function() {
      this.transition(function() {
        this.coins += 1;
      });
    });
  });

  it("should define event methods", function() {
    assert(typeof stateMachine.push === 'function');
    assert(typeof stateMachine.coin === 'function');
  });

  it("should change the context of the event handler", function() {
    stateMachine.push('foo', 'bar');
    assert(eventHandlerContext === stateMachine);
  });

  it("should pass arguments to the event handler properly", function() {
    stateMachine.push('foo', 'bar');
    assert(eventHandlerArguments[0] === 'foo');
    assert(eventHandlerArguments[1] === 'bar');
  });

  describe("#transition", function() {
    it("should change state appropriately", function() {
      assert(stateMachine.state === "locked");

      stateMachine.push();
      assert(stateMachine.state === "locked");

      stateMachine.push();
      assert(stateMachine.state === "locked");

      stateMachine.coin();
      assert(stateMachine.state === "unlocked");

      stateMachine.coin();
      assert(stateMachine.state === "unlocked");

      stateMachine.push();
      assert(stateMachine.state === "locked");
    });

    it("should execute the callback only if it can transition", function() {
      assert(stateMachine.coins === 0);
      assert(stateMachine.pushes === 0);

      stateMachine.push();
      stateMachine.coin();
      stateMachine.coin();
      stateMachine.push();
      stateMachine.push();
      stateMachine.coin();

      assert(stateMachine.coins === 3);
      assert(stateMachine.pushes === 1);
    });

    it("should pass arguments to the callback appropriately", function() {
      assert(stateMachine.state === "locked");

      stateMachine.coin();
      stateMachine.push();

      assert(transitionArguments[0] === "unlocked");
      assert(transitionArguments[1] === "locked");
    });
  });

  describe("#can", function() {
    it("should let you know if it can emit an event", function() {
      assert(stateMachine.state === "locked");
      assert(stateMachine.can("push") === false);
      assert(stateMachine.can("coin") === true);

      stateMachine.coin();
      assert(stateMachine.can("push") === true);
      assert(stateMachine.can("coin") === true);
    });

    it("should return false when you pass an undefined event", function() {
      assert(stateMachine.can("fail") === false);
    })
  });

  describe("a mixin", function() {
    it("should mixin", function() {
      var object = StateMachine({});

      for (var key in StateMachine.prototype)
        assert(typeof object[key] === typeof StateMachine.prototype[key]);
    });

    it(
      "should define the event methods if `events` property was already set",
      function() {
        var button = StateMachine({
          events: {
            "push": [
              { from: ["on"], to: "off" },
              { from: ["off"], to: "on" }
            ]
          }
        });

        assert(typeof button.push === 'function');
      }
    );
  });
});
