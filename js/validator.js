/** Input validation and solvability */

import { CELL_COUNT } from './config.js';
import { STR } from './strings-zh.js';

export function validateBoard(board) {
  if (!board || board.length !== CELL_COUNT) {
    return { valid: false, message: STR.needNine };
  }

  const seen = new Set();
  for (const v of board) {
    if (!Number.isInteger(v) || v < 0 || v > 8) {
      return { valid: false, message: STR.cellInt };
    }
    if (seen.has(v)) {
      return {
        valid: false,
        message: STR.cellDup.replace('{v}', String(v)),
      };
    }
    seen.add(v);
  }

  if (seen.size !== CELL_COUNT) {
    return { valid: false, message: STR.needAll };
  }

  return { valid: true, message: '' };
}

function countInversions(board) {
  const tiles = board.filter((x) => x !== 0);
  let inv = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inv++;
    }
  }
  return inv;
}

export function isSolvable(start, goal) {
  return countInversions(start) % 2 === countInversions(goal) % 2;
}

export function checkSolvable(start, goal) {
  const validation = validateBoard(start);
  if (!validation.valid) return { ok: false, reason: validation.message };

  const goalValidation = validateBoard(goal);
  if (!goalValidation.valid) return { ok: false, reason: STR.goalErr };

  if (boardsEqualStatic(start, goal)) {
    return { ok: true, alreadyGoal: true };
  }

  if (!isSolvable(start, goal)) {
    return { ok: false, reason: STR.unsolvable };
  }

  return { ok: true, alreadyGoal: false };
}

function boardsEqualStatic(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
