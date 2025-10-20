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
      // remove generated "P1", "P2", ... labels — use empty labels so x-axis shows nothing
      const chartLabels = labels.length ? labels : actual.map(() => '');

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
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(122,47,255,0.95)',  // <- purplish background
              titleColor: '#fff',
              bodyColor: '#fff',
              displayColors: false,
              padding: 10,
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => {
                  const v = ctx.raw;
                  return `${ctx.dataset.label}: ${v}`;
                }
              }
            }
          },
          scales: {
            x: { display: false },
            y: {
              display: false,
              grid: {
                color: 'rgba(255,255,255,0.06)',
                drawBorder: false,
                tickLength: 0
              }
            }
          },
          elements: {
            line: { capBezierPoints: true },
            point: { hoverRadius: 8 }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      });
    });
  }

  // --- Savings entry modal logic ---
  const modal = document.getElementById('savingsModal');
  const modalBackdrop = modal?.querySelector('.savings-modal__backdrop');
  const modalName = modal?.querySelector('.savings-modal__target-name');
  const modalCurrent = modal?.querySelector('.savings-modal__current-value');
  const modalEntries = modal?.querySelector('.savings-modal__entries');
  const amountInput = document.getElementById('savingsAmount');
  const saveBtn = document.getElementById('savingsSave');
  const cancelBtn = document.getElementById('savingsCancel');

  let modalTargetEl = null;

  function parseAmountRaw(raw) {
    if (!raw) return 0;
    const cleaned = String(raw).replace(/[^0-9.-]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;
  }

  function getEntries(el) {
    try { return JSON.parse(el.dataset.entries || '[]'); } catch (e) { return []; }
  }
  function setEntries(el, arr) {
    el.dataset.entries = JSON.stringify(arr);
  }
  function sumEntries(el) {
    const arr = getEntries(el);
    return arr.reduce((s,n)=>(s+Number(n||0)),0);
  }

  function openModalFor(targetEl) {
    modalTargetEl = targetEl;
    const title = targetEl.querySelector('.card-title')?.textContent?.trim() || targetEl.id || 'Savings';
    modalName.textContent = title;
    const existing = getEntries(targetEl);
    modalCurrent.textContent = `P${sumEntries(targetEl).toLocaleString()}`;
    // render entries
    renderEntriesList(existing);
    amountInput.value = '';
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=> amountInput.focus(),80);
  }

  function closeModal() {
    modalTargetEl = null;
    modal.setAttribute('aria-hidden','true');
  }

  function renderEntriesList(entries) {
    if (!modalEntries) return;
    if (!entries || !entries.length) {
      modalEntries.innerHTML = '<div class="muted">No entries yet.</div>';
      return;
    }
    modalEntries.innerHTML = '';
    const ul = document.createElement('ul');
    entries.forEach((v,i) => {
      const li = document.createElement('li');
      li.textContent = `P${Number(v).toLocaleString()}`;
      ul.appendChild(li);
    });
    modalEntries.appendChild(ul);
  }

  // save handler
  saveBtn?.addEventListener('click', (e) => {
    if (!modalTargetEl) return;
    const amount = parseAmountRaw(amountInput.value);
    if (amount <= 0) { alert('Enter a valid amount'); amountInput.focus(); return; }

    const entries = getEntries(modalTargetEl);
    entries.push(amount);
    setEntries(modalTargetEl, entries);

    // update data-current to the sum of entries
    const total = sumEntries(modalTargetEl);
    modalTargetEl.dataset.current = total;

    // update card display value
    const big = modalTargetEl.querySelector('.big');
    if (big) big.textContent = `P${total.toLocaleString()}`;

    // re-render entries and current shown in modal
    renderEntriesList(entries);
    modalCurrent.textContent = `P${total.toLocaleString()}`;

    // update hero totals
    if (typeof updateTotalsDisplay === 'function') updateTotalsDisplay();

    // close modal after short delay
    setTimeout(() => closeModal(), 240);
  });

  cancelBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=> {
    if (e.key === 'Escape') closeModal();
  });

  // Replace previous quick prompt behavior: open modal instead
  document.querySelectorAll('.btn-input[data-target]').forEach(btn => {
    btn.removeEventListener?.('click', ()=>{}); // safe remove
    btn.addEventListener('click', (ev) => {
      const sel = btn.dataset.target;
      const target = document.querySelector(sel);
      if (!target) return;
      openModalFor(target);
    });
  });

  // initial totals update (in case dataset.current already present)
  if (typeof updateTotalsDisplay === 'function') updateTotalsDisplay();
});