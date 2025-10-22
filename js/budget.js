// Budget page interaction handlers
document.addEventListener('DOMContentLoaded', () => {
  // Add initial animations
  const table = document.querySelector('.alloc-table');
  const header = document.querySelector('.budget-header');
  const actions = document.querySelector('.budget-actions');

  if (header) header.classList.add('animate-fade-in');
  if (table) {
    table.style.opacity = '0';
    setTimeout(() => {
      table.style.transition = 'all 0.6s ease-out';
      table.style.opacity = '1';
    }, 300);
  }
  if (actions) actions.classList.add('animate-fade-in');

  // Animate table rows on load
  const rows = document.querySelectorAll('.alloc-table tbody tr');
  rows.forEach((row, index) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      row.style.transition = 'all 0.4s ease-out';
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }, 100 * (index + 1));
  });

  // Reset button handler with animation
  document.querySelector('.btn-reset')?.addEventListener('click', () => {
    const rows = document.querySelectorAll('.alloc-table tbody tr');
    const amounts = [1500, 1500, 1200, 900, 600, 300]; // base values
    
    rows.forEach((r, i) => {
      const td = r.querySelector('.align-right');
      if (td) {
        td.style.transition = 'all 0.3s ease';
        td.style.transform = 'scale(0.8)';
        td.style.opacity = '0';
        
        setTimeout(() => {
          td.textContent = `P${amounts[i].toLocaleString()}`;
          td.style.transform = 'scale(1)';
          td.style.opacity = '1';
        }, 300);
      }
    });
  });

  // Add category with animation
  document.querySelector('.btn-add')?.addEventListener('click', () => {
    const name = prompt('Add category name');
    if (!name) return;
    
    // Create new row with animation
    const tbody = document.querySelector('.alloc-table tbody');
    if (tbody) {
      const tr = document.createElement('tr');
      tr.style.opacity = '0';
      tr.style.transform = 'translateY(20px)';
      tr.innerHTML = `
        <td>${name}</td>
        <td class="align-right">P0</td>
      `;
      tbody.appendChild(tr);
      
      // Trigger animation
      requestAnimationFrame(() => {
        tr.style.transition = 'all 0.4s ease-out';
        tr.style.opacity = '1';
        tr.style.transform = 'translateY(0)';
      });
    }
  });

  // Add hover animations to buttons
  const buttons = document.querySelectorAll('.btn-reset, .btn-add');
  buttons.forEach(btn => btn.classList.add('hover-lift'));
});