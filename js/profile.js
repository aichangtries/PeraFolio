document.addEventListener('DOMContentLoaded', () => {
    // Reset Account
    document.querySelector('.btn-reset')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your account? This action cannot be undone.')) {
            // Add reset logic here
            alert('Account reset successfully');
            window.location.href = 'landing.html';
        }
    });

    // Delete Account
    document.querySelector('.btn-delete')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Add delete logic here
            alert('Account deleted successfully');
            window.location.href = 'landing.html';
        }
    });

    // Logout functionality for all logout buttons
    const handleLogout = (event) => {
        event.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'landing.html';
        }
    };

    // Add event listeners to all logout buttons (sidebar, mobile menu, and bottom button)
    document.querySelectorAll('.logout, .btn-logout').forEach(button => {
        button.addEventListener('click', handleLogout);
    });
});