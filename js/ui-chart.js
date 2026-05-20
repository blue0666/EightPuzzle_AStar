/** Chart.js 柱状图：扩展节点数、生成节点数对比 */

import { STR } from './strings-zh.js';

let expandedChart = null;
let generatedChart = null;

/* 与 style.css 中 BFS / 不在位数 / 曼哈顿 主题色一致 */
const CHART_COLORS = [
  'rgba(59, 89, 152, 0.82)',
  'rgba(45, 106, 90, 0.82)',
  'rgba(107, 76, 154, 0.82)',
];

const BORDER_COLORS = [
  'rgb(59, 89, 152)',
  'rgb(45, 106, 90)',
  'rgb(107, 76, 154)',
];

function createOrUpdateBarChart(canvasId, label, labels, data, existingChart) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return existingChart;

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: CHART_COLORS,
          borderColor: BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  };

  if (existingChart) {
    existingChart.data.labels = labels;
    existingChart.data.datasets[0].data = data;
    existingChart.update();
    return existingChart;
  }

  return new Chart(canvas, config);
}

export function updateCharts(results) {
  const labels = results.map((r) => r.label);
  expandedChart = createOrUpdateBarChart(
    'chart-expanded',
    STR.chartExpandedLabel,
    labels,
    results.map((r) => r.expanded),
    expandedChart
  );
  generatedChart = createOrUpdateBarChart(
    'chart-generated',
    STR.chartGeneratedLabel,
    labels,
    results.map((r) => r.generated),
    generatedChart
  );
}

export function destroyCharts() {
  if (expandedChart) {
    expandedChart.destroy();
    expandedChart = null;
  }
  if (generatedChart) {
    generatedChart.destroy();
    generatedChart = null;
  }
}