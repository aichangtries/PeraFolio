// Lightweight helpers: render SVG progress rings and initialize small line charts (Chart.js)
document.addEventListener('DOMContentLoaded', () => {
  // Progress rings: animate only the top-right hero rings (avoid targeting rings inside cards)
  document.querySelectorAll('.ring .progress-ring').forEach(svg => {
    const fg = svg.querySelector('.fg');
    const r = fg.r.baseVal.value;
    const c = 2 * Math.PI * r;
    fg.style.strokeDasharray = `${c}`;
    fg.style.strokeDashoffset = `${c}`;
    const pct = Number(svg.dataset.progress) || 0;
    requestAnimationFrame(() => {
      const offset = c - (pct / 100) * c;
      fg.style.strokeDashoffset = offset;
    });
    const label = svg.nextElementSibling?.querySelector?.('.num');
    if (label) label.textContent = `${pct}%`;
  });

  // Initialize small charts using Chart.js if available
  if (window.Chart) {
    // find canvases with data-series attribute
    document.querySelectorAll('canvas[data-series]').forEach(canvas => {
      let raw;
      try { raw = JSON.parse(canvas.dataset.series); } catch (err) { raw = null; }
      if (!raw) return;

      // Normalize data into three arrays: actual, minimum, projected
      let actual = [], minimum = [], projected = [];
      if (Array.isArray(raw)) {
        actual = raw;
        minimum = actual.map(v => Math.round(v * 0.6));    // soft benchmark
        projected = actual.map(v => Math.round(v * 1.12)); // simple projection
      } else {
        actual = Array.isArray(raw.actual) ? raw.actual : (raw.actual ? [raw.actual] : []);
        minimum = Array.isArray(raw.minimum) ? raw.minimum : (raw.minimum ? [raw.minimum] : actual.map(v => Math.round(v * 0.6)));
        projected = Array.isArray(raw.projected) ? raw.projected : (raw.projected ? [raw.projected] : actual.map(v => Math.round(v * 1.12)));
      }

      const labels = JSON.parse(canvas.dataset.labels || '[]');
      const chartLabels = labels.length ? labels : actual.map((_, i) => `P${i+1}`);

      new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            // Minimum: soft filled line (benchmark) — rendered first (below)
            {
              label: 'Minimum',
              data: minimum,
              borderColor: 'rgba(162,89,255,0.48)',
              backgroundColor: 'rgba(162,89,255,0.10)',
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
              tension: 0.36,
              order: 1
            },

            // Actual: solid line (foreground)
            {
              label: 'Actual',
              data: actual,
              borderColor: 'rgba(11,11,11,0.98)',
              backgroundColor: 'rgba(0,0,0,0.06)',
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#fff',
              fill: true,
              tension: 0.36,
              order: 2
            },

            // Projected: dashed line (no fill)
            {
              label: 'Projected',
              data: projected,
              borderColor: 'rgba(255,255,255,0.40)',
              borderWidth: 2,
              pointRadius: 0,
              borderDash: [6, 6],
              fill: false,
              tension: 0.36,
              order: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          },
          elements: { point: { hoverRadius: 6 } },
          interaction: { intersect: false, mode: 'index' }
        }
      });
    });
  }

  // Quick input savings demo: attach to buttons with data-target
  document.querySelectorAll('.btn-input[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.target);
      const current = Number(target.dataset.current || 0);
      const goal = Number(target.dataset-goal || target.dataset.goal || 1000);
      const add = Number(prompt('Add amount', '500')) || 0;
      const next = Math.min(current + add, goal);
      target.dataset.current = next;
      // update shown value inside .saving-val .big
      const big = target.querySelector('.big');
      if (big) big.textContent = `P${next.toLocaleString()}`;

      // removed progress-ring update for card rings (no JS ring updates for cards)
      // If you later want to re-enable an animated ring inside cards, add a dedicated selector and code here.
    });
  });
});