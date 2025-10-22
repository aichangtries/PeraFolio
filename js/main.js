document.addEventListener('DOMContentLoaded', () => {
    const menuWrapper = document.querySelector('.menu-wrapper');
    const burger = document.querySelector('.menu-burger');
    const menuNav = document.querySelector('.menu-nav-flyout');
    let isMenuOpen = false;

    // Check if device is touch-enabled
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    // Check if viewport is mobile/tablet
    const isMobileView = () => {
        return window.innerWidth <= 1024;
    };

    // Toggle menu function
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        burger.setAttribute('aria-expanded', isMenuOpen);
        menuNav.style.visibility = isMenuOpen ? 'visible' : 'hidden';
        menuNav.style.opacity = isMenuOpen ? '1' : '0';
        burger.classList.toggle('active');
    };

    // Only handle burger click on mobile/tablet
    burger?.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling to document
        if (isMobileView()) {
            toggleMenu();
        }
    });

    // Prevent clicks inside menu from bubbling
    menuNav?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            burger?.setAttribute('aria-expanded', 'false');
            menuNav.style.visibility = 'hidden';
            menuNav.style.opacity = '0';
            burger?.classList.remove('active');
        }
    });

    // If touch device, remove hover effects
    if (isTouchDevice()) {
        // Remove hover-based menu trigger
        menuWrapper?.classList.add('touch-device');
        
        // Handle touch events on menu items
        const menuItems = document.querySelectorAll('.menu-nav-flyout a');
        menuItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const wasActive = this.classList.contains('active-touch');
                
                // Remove active state from all items
                menuItems.forEach(i => i.classList.remove('active-touch'));
                
                // Toggle active state on touched item
                if (!wasActive) {
                    this.classList.add('active-touch');
                }
            });
        });
    }
});