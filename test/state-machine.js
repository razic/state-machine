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
    stateMachine.state = "off";
    stateMachine.events = {
      "push": [
        { from: ["on"], to: "off"  },
        { from: ["off"], to: "on"  }
      ]
    };
    stateMachine.on("push", function() {
      eventHandlerContext = this;
      eventHandlerArguments = arguments;

      this.transition(function() {
        transitionArguments = arguments;
        this.pushes += 1;
      });
    });
  });

  it("should define event methods", function() {
    assert(typeof stateMachine.push === 'function');
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
      assert(stateMachine.state === "off");
      stateMachine.push();
      assert(stateMachine.state === "on");
      stateMachine.push();
      assert(stateMachine.state === "off");
      stateMachine.push();
      assert(stateMachine.state === "on");
      stateMachine.push();
      assert(stateMachine.state === "off");
    });

    it("should execute the callback only if the state changed", function() {
      stateMachine.push();
      stateMachine.push();
      assert(stateMachine.pushes === 2);
      stateMachine.events = { "push": [{ from: ["on", "off"], to: "off" }] };
      stateMachine.push();
      stateMachine.push();
      assert(stateMachine.pushes === 2);
    });

    it("should pass arguments to the callback appropriately", function() {
      stateMachine.push();
      assert(transitionArguments[0] === "off");
      assert(transitionArguments[1] === "on");
    });
  });
});
