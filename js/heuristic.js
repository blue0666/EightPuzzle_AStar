/** 估价函数 h(n)：不在位数、曼哈顿距离 */

import { BOARD_SIZE } from './config.js';
import { indexToRowCol } from './state.js';

/**
 * 目标中每个数字的位置
 * @param {number[]} goal
 * @returns {Map<number, {row: number, col: number}>}
 */
function buildGoalPositions(goal) {
  const map = new Map();
  for (let i = 0; i < goal.length; i++) {
    const v = goal[i];
    if (v === 0) continue;
    map.set(v, indexToRowCol(i));
  }
  return map;
}

/**
 * h1：不在位数（1～8 不在目标位置的个数）
 * @param {number[]} board
 * @param {number[]} goal
 */
export function misplacedTiles(board, goal) {
  let count = 0;
  for (let i = 0; i < board.length; i++) {
    const v = board[i];
    if (v === 0) continue;
    if (v !== goal[i]) count++;
  }
  return count;
}

/**
 * h2：曼哈顿距离（1～8 到目标位置的距离之和）
 * @param {number[]} board
 * @param {number[]} goal
 */
export function manhattanDistance(board, goal) {
  const goalPos = buildGoalPositions(goal);
  let sum = 0;
  for (let i = 0; i < board.length; i++) {
    const v = board[i];
    if (v === 0) continue;
    const { row, col } = indexToRowCol(i);
    const target = goalPos.get(v);
    sum += Math.abs(row - target.row) + Math.abs(col - target.col);
  }
  return sum;
}

/** BFS 对照：h(n) = 0 */
export function zeroHeuristic() {
  return 0;
}