/** Chart.js 柱状图：扩展节点数、生成节点数对比 */

import { STR } from './strings-zh.js';

let expandedChart = null;
let generatedChart = null;

const CHART_COLORS = [
  'rgba(14, 165, 233, 0.75)',
  'rgba(16, 185, 129, 0.75)',
  'rgba(245, 158, 11, 0.75)',
];

const BORDER_COLORS = [
  'rgb(14, 165, 233)',
  'rgb(16, 185, 129)',
  'rgb(245, 158, 11)',
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