/** Global constants */

import { STR } from './strings-zh.js';

export const BOARD_SIZE = 3;
export const CELL_COUNT = 9;

export const GOAL = [1, 2, 3, 8, 0, 4, 7, 6, 5];
export const DEFAULT_START = [7, 5, 3, 1, 6, 4, 2, 8, 0];

export const MOVES = [
  { name: 'up', dr: -1, dc: 0 },
  { name: 'down', dr: 1, dc: 0 },
  { name: 'left', dr: 0, dc: -1 },
  { name: 'right', dr: 0, dc: 1 },
];

export const ALGO_KEYS = ['bfs', 'misplaced', 'manhattan'];

export const ALGO_LABELS = {
  bfs: 'BFS',
  misplaced: STR.algoMisplaced,
  manhattan: STR.algoManhattan,
};

export const ALGO_HEURISTIC_DESC = {
  bfs: 'h(n) = 0',
  misplaced: STR.misplaced,
  manhattan: STR.manhattan,
};
