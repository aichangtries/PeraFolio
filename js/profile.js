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

    // Logout
    document.querySelector('.btn-logout')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            // Add logout logic here
            window.location.href = 'landing.html';
        }
    });
});