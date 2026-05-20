/** 输入校验与可解性判断（3×3 八数码逆序对奇偶性） */

import { CELL_COUNT } from './config.js';
import { STR } from './strings-zh.js';

/** 检查 9 格是否为 0～8 各出现一次 */
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

/** 按行优先、忽略空格统计逆序对 */
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

/** 初态能否到达目标：逆序数奇偶性与目标相同 */
export function isSolvable(start, goal) {
  return countInversions(start) % 2 === countInversions(goal) % 2;
}

/** 综合校验，返回是否可继续求解 */
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