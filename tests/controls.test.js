import test from "node:test";
import assert from "node:assert/strict";

import { setupKeyboardControls } from "../js/controls.js";

test("setupKeyboardControls ignores direction input while locked", () => {
  const originalDocument = globalThis.document;

  let keydownHandler = null;
  let direction = "right";
  let directionLocked = true;

  // Simulate the browser's document event listener
  globalThis.document = {
    addEventListener(eventType, handler) {
      if (eventType === "keydown") {
        keydownHandler = handler;
      }
    }
  };

  try {
    setupKeyboardControls(
      () => direction,
      (newDirection) => {
        direction = newDirection;
        directionLocked = true;
      },
      () => true,
      () => {},
      () => directionLocked
    );

    // Simulate pressing ArrowUp while direction is locked
    keydownHandler({
      key: "ArrowUp",
      code: "ArrowUp",
      preventDefault() {}
    });

    // Direction should remain unchanged
    assert.equal(direction, "right");
    assert.equal(directionLocked, true);
  } finally {
    // Restore the original document
    globalThis.document = originalDocument;
  }
});


test("setupKeyboardControls rejects reverse-direction input", () => {
  const originalDocument = globalThis.document;

  let keydownHandler = null;
  let direction = "right";

  globalThis.document = {
    addEventListener(eventType, handler) {
      if (eventType === "keydown") {
        keydownHandler = handler;
      }
    }
  };

  try {
    setupKeyboardControls(
      () => direction,
      (newDirection) => {
        direction = newDirection;
      },
      () => true,
      () => {},
      () => false
    );

    // Attempt to reverse from right to left
    keydownHandler({
      key: "ArrowLeft",
      code: "ArrowLeft",
      preventDefault() {}
    });

    // Verify the reverse direction was rejected
    assert.equal(direction, "right");
  } finally {
    globalThis.document = originalDocument;
  }
});


test("setupKeyboardControls accepts valid direction changes", () => {
  const originalDocument = globalThis.document;

  let keydownHandler = null;
  let direction = "right";
  let directionLocked = false;

  globalThis.document = {
    addEventListener(eventType, handler) {
      if (eventType === "keydown") {
        keydownHandler = handler;
      }
    }
  };

  try {
    setupKeyboardControls(
      () => direction,
      (newDirection) => {
        direction = newDirection;
        directionLocked = true;
      },
      () => true,
      () => {},
      () => directionLocked
    );

    // Turn upward while traveling right
    keydownHandler({
      key: "ArrowUp",
      code: "ArrowUp",
      preventDefault() {}
    });

    // Verify the valid direction was accepted
    assert.equal(direction, "up");

    // Verify the direction is now locked
    assert.equal(directionLocked, true);
  } finally {
    globalThis.document = originalDocument;
  }
});