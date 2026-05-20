/** 主界面：串联校验、三种求解、结果表、同步演示 */

import {
  GOAL,
  DEFAULT_START,
  ALGO_KEYS,
  ALGO_LABELS,
  ALGO_HEURISTIC_DESC,
} from './config.js';
import { STR } from './strings-zh.js';
import { applyI18n } from './apply-i18n.js';
import { misplacedTiles, manhattanDistance } from './heuristic.js';
import { checkSolvable } from './validator.js';
import { randomSolvableStart } from './random.js';
import { solveAStar } from './solver-astar.js';
import { solveBFS } from './solver-bfs.js';
import {
  buildInputGrid,
  readBoardFromInputs,
  setInputBoard,
  markInvalidInputs,
  renderBoard,
  renderProgressDots,
  updateStepLabel,
} from './ui-board.js';
import { updateCharts, destroyCharts } from './ui-chart.js';

let startInputs = [];

const demoState = {
  bfs: { path: [], stepIndex: 0, timer: null },
  misplaced: { path: [], stepIndex: 0, timer: null },
  manhattan: { path: [], stepIndex: 0, timer: null },
};

const boardEls = {
  bfs: document.getElementById('board-bfs'),
  misplaced: document.getElementById('board-misplaced'),
  manhattan: document.getElementById('board-manhattan'),
};

const stepEls = {
  bfs: document.getElementById('step-bfs'),
  misplaced: document.getElementById('step-misplaced'),
  manhattan: document.getElementById('step-manhattan'),
};

const dotsEls = {
  bfs: document.getElementById('dots-bfs'),
  misplaced: document.getElementById('dots-misplaced'),
  manhattan: document.getElementById('dots-manhattan'),
};

function init() {
  applyI18n();

  const grid = document.getElementById('start-grid');
  startInputs = buildInputGrid(grid, DEFAULT_START);

  document.getElementById('btn-default').addEventListener('click', onDefault);
  document.getElementById('btn-random').addEventListener('click', onRandom);
  document.getElementById('btn-solve').addEventListener('click', onSolve);
  document.getElementById('report-toggle').addEventListener('click', onReportToggle);

  document.querySelectorAll('.step-prev').forEach((btn) => {
    btn.addEventListener('click', () => stepMove(btn.dataset.algo, -1));
  });
  document.querySelectorAll('.step-next').forEach((btn) => {
    btn.addEventListener('click', () => stepMove(btn.dataset.algo, 1));
  });
  document.querySelectorAll('.step-play').forEach((btn) => {
    btn.addEventListener('click', () => togglePlay(btn.dataset.algo));
  });

  ['step-bfs', 'step-misplaced', 'step-manhattan'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = STR.dash;
  });
}

function onDefault() {
  setInputBoard(startInputs, DEFAULT_START);
  hideError();
}

function onRandom() {
  setInputBoard(startInputs, randomSolvableStart(GOAL));
  hideError();
}

function onReportToggle() {
  const content = document.getElementById('report-content');
  const btn = document.getElementById('report-toggle');
  const open = content.hidden;
  content.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open
    ? STR.reportToggle + ' \u25b2'
    : STR.reportToggle + ' \u25bc';
}

function hideError() {
  const el = document.getElementById('input-error');
  el.hidden = true;
  el.textContent = '';
}

function showError(msg) {
  const el = document.getElementById('input-error');
  el.hidden = false;
  el.textContent = msg;
}

function showUnsolvable(msg) {
  stopAllPlay();
  const el = document.getElementById('unsolvable-msg');
  el.hidden = false;
  el.textContent = '\u26a0 ' + msg;
  document.getElementById('result-tbody').innerHTML = '';
  destroyCharts();
  clearDemoColumns();
}

function hideUnsolvable() {
  document.getElementById('unsolvable-msg').hidden = true;
}

function clearDemoColumns() {
  for (const key of ALGO_KEYS) {
    demoState[key] = { path: [], stepIndex: 0, timer: null };
    if (boardEls[key]) boardEls[key].innerHTML = '';
    if (stepEls[key]) stepEls[key].textContent = STR.dash;
    if (dotsEls[key]) dotsEls[key].innerHTML = '';
  }
}

function onSolve() {
  hideError();
  hideUnsolvable();
  stopAllPlay();

  const start = readBoardFromInputs(startInputs);
  const check = checkSolvable(start, GOAL);

  if (!check.ok) {
    markInvalidInputs(startInputs);
    if (check.reason === STR.unsolvable) {
      showUnsolvable(check.reason);
    } else {
      showError(check.reason);
      clearDemoColumns();
    }
    return;
  }

  if (check.alreadyGoal) {
    showResultsAllZero(start);
    return;
  }

  const t0 = performance.now();
  const bfsResult = solveBFS(start, GOAL);
  const t1 = performance.now();
  const misplacedResult = solveAStar(start, GOAL, misplacedTiles);
  const t2 = performance.now();
  const manhattanResult = solveAStar(start, GOAL, manhattanDistance);
  const t3 = performance.now();

  const results = [
    {
      key: 'bfs',
      label: ALGO_LABELS.bfs,
      heuristic: ALGO_HEURISTIC_DESC.bfs,
      result: bfsResult,
      timeMs: Math.round(t1 - t0),
    },
    {
      key: 'misplaced',
      label: ALGO_LABELS.misplaced,
      heuristic: ALGO_HEURISTIC_DESC.misplaced,
      result: misplacedResult,
      timeMs: Math.round(t2 - t1),
    },
    {
      key: 'manhattan',
      label: ALGO_LABELS.manhattan,
      heuristic: ALGO_HEURISTIC_DESC.manhattan,
      result: manhattanResult,
      timeMs: Math.round(t3 - t2),
    },
  ];

  if (results.some((r) => !r.result.success)) {
    showUnsolvable(STR.searchFail);
    return;
  }

  renderResultTable(results);
  updateCharts(
    results.map((r) => ({
      label: r.label,
      expanded: r.result.expanded,
      generated: r.result.generated,
    }))
  );

  for (const r of results) {
    demoState[r.key] = { path: r.result.path, stepIndex: 0, timer: null };
    refreshDemoColumn(r.key);
  }

  document.getElementById('demo-hint').textContent = STR.demoHintDone;
}

function showResultsAllZero(start) {
  document.getElementById('result-tbody').innerHTML = ALGO_KEYS.map(
    (key) => `
    <tr>
      <td>${ALGO_LABELS[key]}</td>
      <td>${ALGO_HEURISTIC_DESC[key]}</td>
      <td>0</td><td>0</td><td>1</td><td>0</td>
    </tr>`
  ).join('');

  updateCharts(
    ALGO_KEYS.map((key) => ({
      label: ALGO_LABELS[key],
      expanded: 0,
      generated: 1,
    }))
  );

  const path = [start];
  for (const key of ALGO_KEYS) {
    demoState[key] = { path, stepIndex: 0, timer: null };
    refreshDemoColumn(key);
  }
}

function renderResultTable(results) {
  document.getElementById('result-tbody').innerHTML = results
    .map(
      (r) => `
    <tr>
      <td>${r.label}</td>
      <td>${r.heuristic}</td>
      <td>${r.result.steps}</td>
      <td>${r.result.expanded}</td>
      <td>${r.result.generated}</td>
      <td>${r.timeMs}</td>
    </tr>`
    )
    .join('');
}

function refreshDemoColumn(algo) {
  const state = demoState[algo];
  const path = state.path;
  if (!path.length) return;

  const idx = state.stepIndex;
  renderBoard(boardEls[algo], path[idx], idx > 0 ? path[idx - 1] : null);
  updateStepLabel(stepEls[algo], idx, path.length);
  renderProgressDots(dotsEls[algo], path.length, idx, (i) => {
    setStepIndex(algo, i, true);
  });
}

function setStepIndex(algo, index, sync) {
  const state = demoState[algo];
  if (!state.path.length) return;
  state.stepIndex = Math.max(0, Math.min(index, state.path.length - 1));

  if (sync && document.getElementById('sync-play').checked) {
    for (const key of ALGO_KEYS) {
      demoState[key].stepIndex = Math.min(
        state.stepIndex,
        demoState[key].path.length - 1
      );
      refreshDemoColumn(key);
    }
  } else {
    refreshDemoColumn(algo);
  }
}

function stepMove(algo, delta) {
  setStepIndex(algo, demoState[algo].stepIndex + delta, true);
}

function stopPlay(algo) {
  const state = demoState[algo];
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function stopAllPlay() {
  ALGO_KEYS.forEach(stopPlay);
}

function togglePlay(algo) {
  const state = demoState[algo];
  if (state.timer) {
    stopAllPlay();
    return;
  }

  stopAllPlay();
  const sync = document.getElementById('sync-play').checked;

  state.timer = window.setInterval(() => {
    const keys = sync ? ALGO_KEYS : [algo];
    let allEnd = true;
    for (const key of keys) {
      const s = demoState[key];
      if (!s.path.length) continue;
      if (s.stepIndex < s.path.length - 1) {
        allEnd = false;
        s.stepIndex++;
        refreshDemoColumn(key);
      }
    }
    if (allEnd) stopAllPlay();
  }, 600);

  if (sync) {
    for (const key of ALGO_KEYS) {
      if (key !== algo) demoState[key].timer = state.timer;
    }
  }
}

init();
