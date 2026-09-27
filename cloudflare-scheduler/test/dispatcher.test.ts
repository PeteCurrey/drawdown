import test from "node:test";
import assert from "node:assert/strict";
import { getDueJobs } from "../src/dispatcher.ts";
import { lockManager } from "../src/lock.ts";
import { SCHEDULED_JOBS } from "../src/config.ts";

test("Schedule Audit: All 11 production jobs are registered", () => {
  assert.equal(SCHEDULED_JOBS.length, 11, "Must contain exactly 11 registered scheduled jobs");

  const expectedIds = [
    "signal-scan",
    "market-sync",
    "update-prices",
    "morning-brief-weekday",
    "morning-brief-weekend",
    "evening-wrap",
    "breaking-news",
    "social-ingest",
    "discipline-report",
    "daily-report",
    "lobby-ingest",
  ];

  for (const id of expectedIds) {
    const found = SCHEDULED_JOBS.find((j) => j.id === id);
    assert.ok(found, `Expected job ${id} to be registered`);
  }
});

test("Dispatcher: Evaluates 5-minute Signal Scan correctly", () => {
  // 2026-09-28 10:05:00 UTC (Monday)
  const d5 = new Date(Date.UTC(2026, 8, 28, 10, 5, 0));
  const due5 = getDueJobs(d5).map((j) => j.id);
  assert.ok(due5.includes("signal-scan"), "signal-scan must run at :05");
  assert.ok(!due5.includes("breaking-news"), "breaking-news must not run at :05");

  // 2026-09-28 10:07:00 UTC (not a multiple of 5)
  const d7 = new Date(Date.UTC(2026, 8, 28, 10, 7, 0));
  const due7 = getDueJobs(d7);
  assert.equal(due7.length, 0, "No jobs should run on non-5-minute ticks");
});

test("Dispatcher: Evaluates 15-minute jobs (Breaking News, Social Ingest, Lobby Ingest)", () => {
  // 2026-09-28 10:15:00 UTC
  const d15 = new Date(Date.UTC(2026, 8, 28, 10, 15, 0));
  const due15 = getDueJobs(d15).map((j) => j.id);
  assert.ok(due15.includes("signal-scan"), "signal-scan runs at :15");
  assert.ok(due15.includes("breaking-news"), "breaking-news runs at :15");
  assert.ok(due15.includes("social-ingest"), "social-ingest runs at :15");
  assert.ok(due15.includes("lobby-ingest"), "lobby-ingest runs at :15");
  assert.ok(!due15.includes("market-sync"), "market-sync must not run at :15");
});

test("Dispatcher: Evaluates 30-minute jobs (Market Sync, Update Prices)", () => {
  // 2026-09-28 10:30:00 UTC
  const d30 = new Date(Date.UTC(2026, 8, 28, 10, 30, 0));
  const due30 = getDueJobs(d30).map((j) => j.id);
  assert.ok(due30.includes("market-sync"), "market-sync runs at :30");
  assert.ok(due30.includes("update-prices"), "update-prices runs at :30");
  assert.ok(due30.includes("signal-scan"), "signal-scan runs at :30");
  assert.ok(due30.includes("breaking-news"), "breaking-news runs at :30");
});

test("Dispatcher: Evaluates Daily Report at 06:00 UTC", () => {
  const d06 = new Date(Date.UTC(2026, 8, 28, 6, 0, 0));
  const due06 = getDueJobs(d06).map((j) => j.id);
  assert.ok(due06.includes("daily-report"), "daily-report must run at 06:00 UTC");

  const d07 = new Date(Date.UTC(2026, 8, 28, 7, 0, 0));
  const due07 = getDueJobs(d07).map((j) => j.id);
  assert.ok(!due07.includes("daily-report"), "daily-report must not run at 07:00 UTC");
});

test("Dispatcher: Evaluates Morning Brief weekday vs weekend schedules", () => {
  // Monday 07:00 UTC
  const mon07 = new Date(Date.UTC(2026, 8, 28, 7, 0, 0)); // Monday
  const dueMon07 = getDueJobs(mon07).map((j) => j.id);
  assert.ok(dueMon07.includes("morning-brief-weekday"), "morning-brief-weekday runs Mon 07:00 UTC");
  assert.ok(!dueMon07.includes("morning-brief-weekend"), "morning-brief-weekend must not run on Monday");

  // Saturday 08:00 UTC
  const sat08 = new Date(Date.UTC(2026, 8, 26, 8, 0, 0)); // Saturday
  const dueSat08 = getDueJobs(sat08).map((j) => j.id);
  assert.ok(dueSat08.includes("morning-brief-weekend"), "morning-brief-weekend runs Sat 08:00 UTC");
  assert.ok(!dueSat08.includes("morning-brief-weekday"), "morning-brief-weekday must not run on Saturday");

  // Saturday 07:00 UTC — neither should run
  const sat07 = new Date(Date.UTC(2026, 8, 26, 7, 0, 0));
  const dueSat07 = getDueJobs(sat07).map((j) => j.id);
  assert.ok(!dueSat07.includes("morning-brief-weekday"));
  assert.ok(!dueSat07.includes("morning-brief-weekend"));
});

test("Dispatcher: Evaluates Evening Wrap at 17:00 UTC Mon-Fri", () => {
  const fri17 = new Date(Date.UTC(2026, 8, 25, 17, 0, 0)); // Friday
  const dueFri17 = getDueJobs(fri17).map((j) => j.id);
  assert.ok(dueFri17.includes("evening-wrap"), "evening-wrap runs Fri 17:00 UTC");

  const sun17 = new Date(Date.UTC(2026, 8, 27, 17, 0, 0)); // Sunday
  const dueSun17 = getDueJobs(sun17).map((j) => j.id);
  assert.ok(!dueSun17.includes("evening-wrap"), "evening-wrap must not run on Sunday");
});

test("Dispatcher: Evaluates Discipline Report at 20:00 UTC Sunday", () => {
  const sun20 = new Date(Date.UTC(2026, 8, 27, 20, 0, 0)); // Sunday
  const dueSun20 = getDueJobs(sun20).map((j) => j.id);
  assert.ok(dueSun20.includes("discipline-report"), "discipline-report runs Sun 20:00 UTC");

  const mon20 = new Date(Date.UTC(2026, 8, 28, 20, 0, 0)); // Monday
  const dueMon20 = getDueJobs(mon20).map((j) => j.id);
  assert.ok(!dueMon20.includes("discipline-report"), "discipline-report must not run on Monday");
});

test("LockManager: Prevents overlapping job executions", () => {
  lockManager.reset();

  const acquired1 = lockManager.acquire("signal-scan", 60_000);
  assert.equal(acquired1, true, "First acquire must succeed");

  const acquired2 = lockManager.acquire("signal-scan", 60_000);
  assert.equal(acquired2, false, "Second acquire while in-flight must fail");

  assert.equal(lockManager.isLocked("signal-scan"), true);

  lockManager.release("signal-scan");
  assert.equal(lockManager.isLocked("signal-scan"), false);

  const acquired3 = lockManager.acquire("signal-scan", 60_000);
  assert.equal(acquired3, true, "Acquire after release must succeed");

  lockManager.reset();
});
