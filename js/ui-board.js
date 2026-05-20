/** 棋盘 DOM：9 格输入、3×3 展示、进度点 */

import { diffIndices } from './state.js';
import { STR } from './strings-zh.js';

/** 创建 9 个数字输入框 */
export function buildInputGrid(container, initial) {
  container.innerHTML = '';
  const inputs = [];
  for (let i = 0; i < 9; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '8';
    input.value = String(initial[i]);
    input.setAttribute('aria-label', STR.cellLabel + ' ' + (i + 1));
    container.appendChild(input);
    inputs.push(input);
  }
  return inputs;
}

export function readBoardFromInputs(inputs) {
  return inputs.map((el) => {
    const v = parseInt(el.value, 10);
    return Number.isNaN(v) ? -1 : v;
  });
}

export function setInputBoard(inputs, board) {
  board.forEach((v, i) => {
    inputs[i].value = String(v);
    inputs[i].classList.remove('invalid');
  });
}

export function markInvalidInputs(inputs) {
  inputs.forEach((el) => el.classList.add('invalid'));
}

/** 渲染 3×3 盘面，可选高亮与上一步的差异格 */
export function renderBoard(container, board, prevBoard = null) {
  container.innerHTML = '';
  const highlights = prevBoard ? new Set(diffIndices(board, prevBoard)) : new Set();

  for (let i = 0; i < board.length; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const v = board[i];
    if (v === 0) {
      cell.classList.add('blank');
      cell.textContent = '0';
    } else {
      cell.textContent = String(v);
    }
    if (highlights.has(i)) cell.classList.add('highlight');
    container.appendChild(cell);
  }
}

/** 路径进度点，点击可跳转步骤 */
export function renderProgressDots(container, totalSteps, currentIndex, onSelect) {
  container.innerHTML = '';
  if (totalSteps <= 1) return;

  for (let i = 0; i < totalSteps; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    dot.title = STR.dotTitle.replace('{i}', String(i));
    dot.setAttribute('aria-label', STR.dotAria.replace('{i}', String(i)));
    dot.addEventListener('click', () => onSelect(i));
    container.appendChild(dot);
  }
}

export function updateStepLabel(labelEl, index, total) {
  if (total <= 0) {
    labelEl.textContent = STR.dash;
    return;
  }
  labelEl.textContent = STR.stepFmt
    .replace('{i}', String(index))
    .replace('{max}', String(total - 1));
}