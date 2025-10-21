document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.menu-burger');
    
    burger?.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-wrapper')) {
            burger?.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            burger?.setAttribute('aria-expanded', 'false');
        }
    });
});