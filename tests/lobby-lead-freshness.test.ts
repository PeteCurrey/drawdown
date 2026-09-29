import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { evaluateTimestampFreshness } from "../src/lib/data-freshness-policy.ts";
import type { LobbyArticle } from "../src/types/lobby.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

test("Lobby Lead Freshness Policy: Disqualifies articles past 72h window", () => {
  const now = Date.now();
  const validTimestamp = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const expiredTimestamp = new Date(now - 73 * 60 * 60 * 1000).toISOString();

  const validEvaluation = evaluateTimestampFreshness("lobby_lead", validTimestamp);
  assert.equal(validEvaluation.isEligible, true, "Article at 48h must be eligible for lead");

  const expiredEvaluation = evaluateTimestampFreshness("lobby_lead", expiredTimestamp);
  assert.equal(expiredEvaluation.isEligible, false, "Article past 72h must be disqualified from lead");
  assert.equal(expiredEvaluation.band, "AGED");
});

test("Lobby Lead UI: STALE LEAD banner is completely removed from codebase", () => {
  const leadComponent = readFile("src/components/lobby/LobbyLeadStory.tsx");
  assert.ok(
    !leadComponent.includes("STALE LEAD"),
    "LobbyLeadStory must not render an embarrassing 'STALE LEAD' banner"
  );
  assert.ok(
    !leadComponent.includes("STALE STORY WARNING"),
    "LobbyLeadStory must not render any stale story warning banner"
  );
});

test("Lobby Lead UI: Renders Institutional Standby State when lead is null or empty", () => {
  const leadComponent = readFile("src/components/lobby/LobbyLeadStory.tsx");
  assert.ok(
    leadComponent.includes("MARKET LEAD DESK STANDBY"),
    "Must display institutional desk standby state when no eligible lead exists"
  );
  assert.ok(
    leadComponent.includes("MONITORING G10 CENTRAL BANKS & GLOBAL WIRES"),
    "Standby state must indicate real-time monitoring is active"
  );
  assert.ok(
    leadComponent.includes("72-hour integrity window"),
    "Standby state must explain strict 72h data verification standards"
  );
});

test("Lobby Data Layer: Excludes test content and stale articles from lead query", () => {
  const lobbyLib = readFile("src/lib/lobby.ts");
  
  // Verify excludeStale flag and 72h filter
  assert.ok(
    lobbyLib.includes("excludeStale"),
    "lobby.ts getLobbyLeadStory must support excludeStale filtering"
  );
  assert.ok(
    lobbyLib.includes("is_test"),
    "lobby.ts getLobbyLeadStory must filter out is_test = true"
  );
  assert.ok(
    lobbyLib.includes("retire_at"),
    "lobby.ts getLobbyLeadStory must filter out retired content"
  );
  assert.ok(
    lobbyLib.includes("getLobbyComingUpEvents"),
    "lobby.ts must export getLobbyComingUpEvents for dynamic event queries"
  );
  assert.ok(
    lobbyLib.includes("getLobbyWatchlistItems"),
    "lobby.ts must export getLobbyWatchlistItems for dynamic watchlist queries"
  );
});

test("Lobby Coming Up UI: Hides cleanly if no upcoming events are present", () => {
  const comingUpComponent = readFile("src/components/lobby/LobbyComingUp.tsx");
  assert.ok(
    comingUpComponent.includes("if (!events || events.length === 0)") &&
    comingUpComponent.includes("return null;"),
    "LobbyComingUp must return null when no upcoming events exist"
  );
});

test("Lobby Watchlist UI: Hides cleanly if no active watchlist items are present", () => {
  const watchlistComponent = readFile("src/components/lobby/LobbyWatchlist.tsx");
  assert.ok(
    watchlistComponent.includes("if (!items || items.length === 0)") &&
    watchlistComponent.includes("return null;"),
    "LobbyWatchlist must return null when no items exist"
  );
});
