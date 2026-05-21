/** 广度优先搜索（h=0，按 g 层序扩展） */

import {
  boardToKey,
  boardsEqual,
  cloneBoard,
  getSuccessors,
} from './state.js';

/**
 * @typedef {import('./solver-astar.js').SolveResult} SolveResult
 */

/**
 * @param {number[]} start
 * @param {number[]} goal
 * @returns {SolveResult}
 */
export function solveBFS(start, goal) {
  if (boardsEqual(start, goal)) {
    return {
      success: true,
      path: [cloneBoard(start)],
      steps: 0,
      expanded: 0,
      generated: 1,
    };
  }

  /** @type {{ board: number[], parent: object|null, g: number }[]} */
  const queue = [];
  const visited = new Map(); // 已生成过的状态（BFS 首次到达即最优）

  const startNode = { board: cloneBoard(start), parent: null, g: 0 };
  const startKey = boardToKey(start);
  queue.push(startNode);
  visited.set(startKey, startNode);

  let expanded = 0;
  let generated = 1;
  let head = 0; // 队首指针，避免 shift() 的 O(n) 开销

  while (head < queue.length) {
    const current = queue[head++];
    expanded++;

    for (const nextBoard of getSuccessors(current.board)) {
      const nextKey = boardToKey(nextBoard);
      if (visited.has(nextKey)) continue;

      const nextNode = {
        board: nextBoard,
        parent: current,
        g: current.g + 1,
      };
      generated++;
      visited.set(nextKey, nextNode);

      // 首次到达目标即最短步（按层扩展）
      if (boardsEqual(nextBoard, goal)) {
        return {
          success: true,
          path: reconstructPath(nextNode),
          steps: nextNode.g,
          expanded,
          generated,
        };
      }

      queue.push(nextNode);
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

/** 与 A* 相同：parent 链回溯后反转为初态→目标 */
function reconstructPath(node) {
  const path = [];
  let cur = node;
  while (cur) {
    path.push(cloneBoard(cur.board));
    cur = cur.parent;
  }
  path.reverse();
  return path;
}