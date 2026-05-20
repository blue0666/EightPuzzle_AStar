/** 随机生成可解初态：从目标出发做若干次合法随机移动 */

import { cloneBoard, getSuccessors, boardsEqual } from './state.js';

/**
 * 从 goal 随机游走生成初态（必可解，且不等于 goal）
 * @param {number[]} goal
 * @param {number} shuffleMoves 随机步数
 * @returns {number[]}
 */
export function randomSolvableStart(goal, shuffleMoves = 40) {
  let board = cloneBoard(goal);
  let lastKey = board.join(',');

  for (let i = 0; i < shuffleMoves; i++) {
    const successors = getSuccessors(board);
    const candidates = successors.filter((s) => s.join(',') !== lastKey);
    const pick =
      candidates[Math.floor(Math.random() * candidates.length)] ?? successors[0];
    lastKey = board.join(',');
    board = pick;
  }

  if (boardsEqual(board, goal)) {
    board = getSuccessors(board)[0];
  }
  return board;
}
