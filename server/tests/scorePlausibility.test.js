import test from "node:test";
import assert from "node:assert/strict";

import { isScorePlausible } from "../src/utils/scorePlausibility.js";

const STARTED_AT = new Date("2026-01-01T12:00:00.000Z");

function submittedAfter(milliseconds) {
  return new Date(STARTED_AT.getTime() + milliseconds);
}

test("accepts a plausible score", () => {
  assert.equal(
    isScorePlausible(100, STARTED_AT, submittedAfter(60_000)),
    true
  );
});

test("rejects an extremely inflated score after 60 seconds", () => {
  assert.equal(
    isScorePlausible(13_641, STARTED_AT, submittedAfter(60_000)),
    false
  );
});

test("accepts a modest score after 60 seconds", () => {
  assert.equal(
    isScorePlausible(200, STARTED_AT, submittedAfter(60_000)),
    true
  );
});

test("rejects a submission timestamp before the start", () => {
  assert.equal(
    isScorePlausible(10, STARTED_AT, submittedAfter(-1_000)),
    false
  );
});

test("rejects invalid timestamps", () => {
  assert.equal(
    isScorePlausible(
      100,
      "invalid-date",
      submittedAfter(60_000)
    ),
    false
  );
});

test("allows zero points for a newly created session", () => {
  assert.equal(
    isScorePlausible(0, STARTED_AT, submittedAfter(0)),
    true
  );
});



test("rejects an impossible score after 1 second", () => {
  assert.equal(
    isScorePlausible(500, STARTED_AT, submittedAfter(1_000)),
    false
  );
});

test("rejects an impossible score after 10 seconds", () => {
  assert.equal(
    isScorePlausible(2_000, STARTED_AT, submittedAfter(10_000)),
    false
  );
});

test("accepts a modest score after 10 seconds", () => {
  assert.equal(
    isScorePlausible(50, STARTED_AT, submittedAfter(10_000)),
    true
  );
});


test("rejects an inflated score at zero elapsed time", () => {
  assert.equal(
    isScorePlausible(500, STARTED_AT, submittedAfter(0)),
    false
  );
});


test("enforces the exact theoretical score boundary", () => {
  // At zero elapsed time, the 2-second tolerance permits
  // exactly 10 theoretical movements:
  // 200 + 197 + 194 + ... + 173 = 1865 ms.
  //
  // The 11th movement would require another 170 ms,
  // exceeding the 2000 ms allowance.
  //
  // Maximum theoretical score: 10 * 11 = 110.

  assert.equal(
    isScorePlausible(110, STARTED_AT, submittedAfter(0)),
    true
  );

  assert.equal(
    isScorePlausible(111, STARTED_AT, submittedAfter(0)),
    false
  );
});
