/**
 * Layer 1 of the two-layer moderation approach (TRD Section 4 / PRD 9.4).
 * This never blocks or auto-rejects a submission — it only flags likely
 * spam/profanity so the admin can prioritize it in the moderation queue.
 * Every submission still requires manual approval regardless of this result.
 *
 * The docs don't specify a particular filter library or word list, so this
 * is a small, transparent, easily-extended in-house implementation rather
 * than an npm dependency.
 */

// Deliberately short and generic — extend as needed. Matched as whole words,
// case-insensitively, so this doesn't false-positive on substrings.
const BLOCKED_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "nigger",
  "faggot",
  "whore",
  "slut",
  "retard",
];

const URL_PATTERN = /https?:\/\/|www\./gi;

function containsBlockedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
}

function looksLikeSpam(text: string): boolean {
  const urlMatches = text.match(URL_PATTERN);
  if (urlMatches && urlMatches.length >= 2) return true;

  // Long runs of the same character (e.g. "aaaaaaaaaaaa") are a common spam signal.
  if (/(.)\1{9,}/.test(text)) return true;

  return false;
}

export function isFlaggedContent(text: string): boolean {
  return containsBlockedWord(text) || looksLikeSpam(text);
}
