var assert = require('assert'),
    StateMachine = require('state-machine');

describe('StateMachine', function() {
  var stateMachine;

  beforeEach(function() {
    stateMachine = new StateMachine();
    stateMachine.pushed = 0;
    stateMachine.state = "on";
    stateMachine.events = {
      "push": [
        { from: ["on"], to: "off"  },
        { from: ["off"], to: "on"  }
      ]
    };
    stateMachine.on("on", function() {
      this.transition(function() {
        this.pushed += 1;
      });
    });
    stateMachine.on("off", function() {
      this.transition(function() {
        this.pushed += 1;
      });
    });
  });

  describe("#transition", function() {
    it("should be in the initial state", function() {
      assert(stateMachine.state === "off");
    });
  });
});
