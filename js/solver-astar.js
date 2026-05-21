/** A* 通用求解器 */

import {
  boardToKey,
  boardsEqual,
  cloneBoard,
  getSuccessors,
} from './state.js';
import { PriorityQueue } from './priority-queue.js';

/**
 * @typedef {Object} SolveResult
 * @property {boolean} success
 * @property {number[][]} path - 从初态到目标的盘面序列（含起点与终点）
 * @property {number} steps
 * @property {number} expanded - 扩展节点数
 * @property {number} generated - 生成节点数
 */

/**
 * A* 搜索
 * @param {number[]} start
 * @param {number[]} goal
 * @param {(board: number[], goal: number[]) => number} heuristicFn
 * @returns {SolveResult}
 */
export function solveAStar(start, goal, heuristicFn) {
  if (boardsEqual(start, goal)) {
    return {
      success: true,
      path: [cloneBoard(start)],
      steps: 0,
      expanded: 0,
      generated: 1,
    };
  }

  const startKey = boardToKey(start);
  const open = new PriorityQueue(); // Open 表：按 f 取最小
  const openMap = new Map(); // 盘面 key → 当前最优节点（含 parent，用于回溯）
  const closed = new Set(); // Closed 表：已扩展过的盘面 key

  let expanded = 0;
  let generated = 1;

  const h0 = heuristicFn(start, goal);
  const node0 = {
    board: cloneBoard(start),
    g: 0,
    h: h0,
    f: h0, // 起点 f = g + h
    parent: null,
  };
  openMap.set(startKey, node0);
  open.push(startKey, h0, h0, 0, node0);

  while (!open.isEmpty()) {
    const item = open.pop();
    if (!item) break;

    const { key, payload: node } = item;

    // 堆中可能残留旧条目；已进 Closed 或 g 已不是最优则跳过
    if (closed.has(key)) continue;

    const current = openMap.get(key);
    if (!current || current.g !== node.g) continue;

    // 当前节点即目标：沿 parent 链回溯，不再扩展
    if (boardsEqual(current.board, goal)) {
      return {
        success: true,
        path: reconstructPath(current),
        steps: current.g,
        expanded,
        generated,
      };
    }

    closed.add(key);
    openMap.delete(key);
    expanded++;

    for (const nextBoard of getSuccessors(current.board)) {
      const nextKey = boardToKey(nextBoard);
      if (closed.has(nextKey)) continue;

      const g2 = current.g + 1;
      const existing = openMap.get(nextKey);

      // 已有更优或同优路径到达该状态时，不重复放宽
      if (existing && existing.g <= g2) continue;

      const h2 = heuristicFn(nextBoard, goal);
      const f2 = g2 + h2;
      const nextNode = {
        board: nextBoard,
        g: g2,
        h: h2,
        f: f2,
        parent: current,
      };

      if (!existing) generated++;
      openMap.set(nextKey, nextNode);
      open.push(nextKey, f2, h2, g2, nextNode); // 允许堆内同 key 多条，弹出时靠 g 校验
    }
  }

  return {
    success: false,
    path: [],
    steps: -1,
    expanded,
    generated,
  };
}

/** 从目标节点沿 parent 回溯到初态，得到演示用的盘面序列 */
function reconstructPath(node) {
  const path = [];
  let cur = node;
  while (cur) {
    path.push(cloneBoard(cur.board));
    cur = cur.parent;
  }
  path.reverse(); // 调整为 [初态, …, 目标]
  return path;
}