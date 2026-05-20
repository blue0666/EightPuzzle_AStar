/** 将 strings-zh.js 中的中文文案写入页面 DOM */

import { STR } from './strings-zh.js';

export function applyI18n() {
  document.title = STR.pageTitle;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText('main-title', STR.mainTitle);
  setText('subtitle', STR.subtitle);
  setText('input-section-title', STR.inputSection);
  setText('input-hint', STR.inputHint);
  setText('btn-default', STR.btnDefault);
  setText('btn-random', STR.btnRandom);
  setText('btn-solve', STR.btnSolve);
  setText('goal-title', STR.goalTitle);
  setText('goal-note', STR.goalNote);
  setText('result-section-title', STR.resultSection);
  setText('th-algo', STR.colAlgo);
  setText('th-heuristic', STR.colHeuristic);
  setText('th-steps', STR.colSteps);
  setText('th-expanded', STR.colExpanded);
  setText('th-generated', STR.colGenerated);
  setText('th-time', STR.colTime);
  setText('chart-expanded-title', STR.chartExpanded);
  setText('chart-generated-title', STR.chartGenerated);
  setText('demo-section-title', STR.demoSection);
  setText('sync-play-label', STR.syncPlay);
  setText('demo-hint', STR.demoHint);
  setText('col-sub-misplaced', STR.hMisplaced);
  setText('col-sub-manhattan', STR.hManhattan);
  setText('col-header-misplaced', STR.colMisplaced);
  setText('col-header-manhattan', STR.colManhattan);
  setText('report-toggle', STR.reportToggle + ' \u25bc');
  setText('footer-text', STR.footer);
  setText('report-h2-flow', STR.reportH2Flow);
  setText('report-flow', STR.reportFlow);
  setText('report-h2-heuristic', STR.reportH2Heuristic);
  setText('report-h2-analysis', STR.reportH2Analysis);
  setText('report-analysis', STR.reportAnalysis);

  const list = document.getElementById('report-heuristic-list');
  if (list) {
    list.innerHTML = '';
    STR.heuristicItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }

  document.querySelectorAll('.step-prev').forEach((b) => (b.textContent = STR.btnPrev));
  document.querySelectorAll('.step-next').forEach((b) => (b.textContent = STR.btnNext));
  document.querySelectorAll('.step-play').forEach((b) => (b.textContent = STR.btnPlay));

  const grid = document.getElementById('start-grid');
  if (grid) grid.setAttribute('aria-label', STR.inputSection);
}