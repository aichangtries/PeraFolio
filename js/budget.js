// Budget page interaction handlers
document.addEventListener('DOMContentLoaded', () => {
  // Reset button handler
  document.querySelector('.btn-reset')?.addEventListener('click', () => {
    // Reset table amounts
    const rows = document.querySelectorAll('.alloc-table tbody tr');
    const amounts = [1500, 1500, 1200, 900, 600, 300]; // base values
    rows.forEach((r, i) => {
      const td = r.querySelector('.align-right');
      if (td) td.textContent = `P${amounts[i].toLocaleString()}`;
    });
  });

  // Add category placeholder (non-persistent)
  document.querySelector('.btn-add')?.addEventListener('click', () => {
    const name = prompt('Add category name');
    if (!name) return;
    alert(`New category "${name}" added (demo only).`);
  });
});