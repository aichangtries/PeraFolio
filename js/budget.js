// Build donut chart for budget allocation and make small interactive bits
document.addEventListener('DOMContentLoaded', () => {
  // Data (must match table)
  const labels = ['Food','Tuition','Medicine','Leisure','Gym','Dorm Fee'];
  const values = [900,1500,1200,600,300,1500]; // sums to 6000
  const colors = ['#cfe2ec','#a259ff','#1a1630','#6fc5b0','#4b4b4b','#9b7b72'];

  const ctx = document.getElementById('donutChart').getContext('2d');
  // create donut with inner ring (double donut effect)
  const donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      // thinner ring: increase cutout (was '58%')
      cutout: '78%',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: P${Number(ctx.raw).toLocaleString()} (${Math.round((ctx.raw / 6000)*100)}%)`
          }
        }
      },
      animation: { animateRotate: true, duration: 900 }
    }
  });

  // small UI: Reset button resets to base values
  document.querySelector('.btn-reset')?.addEventListener('click', () => {
    donut.data.datasets[0].data = values.slice();
    donut.update();
    // update table amounts
    const rows = document.querySelectorAll('.alloc-table tbody tr');
    const amounts = [1500,1500,1200,900,600,300]; // ensure matches UI order of table (Dorm Fee second)
    // mapping table order used earlier: Tuition, Dorm Fee, Medicine, Food, Leisure, Gym
    const mapping = [1,0,2,3,4,5]; // convert amounts into table sequence
    rows.forEach((r,i) => {
      const td = r.querySelector('.align-right');
      const amount = amounts[mapping[i]];
      if (td) td.textContent = `P${amount.toLocaleString()}`;
    });
  });

  // Add category placeholder (non-persistent)
  document.querySelector('.btn-add')?.addEventListener('click', () => {
    const name = prompt('Add category name');
    if (!name) return;
    alert(`New category "${name}" added (demo only).`);
  });

  // small responsive tweak: keep chart square
  function resizeDonut() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const parent = canvas.parentElement;
    const size = Math.min(parent.clientWidth * 0.58, 360);
    canvas.width = size;
    canvas.height = size;
    donut.resize();
  }
  window.addEventListener('resize', () => { setTimeout(resizeDonut, 60); });
  resizeDonut();
});