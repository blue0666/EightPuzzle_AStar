/** 棋盘状态表示与基本操作 */

import { BOARD_SIZE, CELL_COUNT } from './config.js';

/** @param {number[]} board */
export function cloneBoard(board) {
  return board.slice();
}

/** @param {number[]} a @param {number[]} b */
export function boardsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** @param {number[]} board */
export function boardToKey(board) {
  return board.join(',');
}

/** @param {number[]} board */
export function indexToRowCol(index) {
  return { row: Math.floor(index / BOARD_SIZE), col: index % BOARD_SIZE };
}

/** @param {number} row @param {number} col */
export function rowColToIndex(row, col) {
  return row * BOARD_SIZE + col;
}

/** @param {number[]} board */
export function findZeroIndex(board) {
  return board.indexOf(0);
}

/**
 * 生成所有合法后继（空格与相邻格交换）
 * @param {number[]} board
 * @returns {number[][]}
 */
export function getSuccessors(board) {
  const zero = findZeroIndex(board);
  const { row, col } = indexToRowCol(zero);
  const successors = [];
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue;
    const next = cloneBoard(board);
    const z = rowColToIndex(nr, nc);
    next[zero] = next[z];
    next[z] = 0;
    successors.push(next);
  }
  return successors;
}

/** @param {number[]} board @param {number[]} goal */
export function formatBoardLines(board, goal = null) {
  const lines = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push(board[rowColToIndex(r, c)]);
    }
    lines.push(row.join(' '));
  }
  return lines;
}

/**
 * 比较两盘面的差异格（用于高亮）
 * @returns {number[]} 索引列表
 */
export function diffIndices(a, b) {
  const diff = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    if (a[i] !== b[i]) diff.push(i);
  }
  return diff;
}
