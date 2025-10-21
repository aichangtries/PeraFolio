document.addEventListener('DOMContentLoaded', () => {
    // Reset Account
    document.querySelector('.btn-reset')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your account? This cannot be undone.')) {
            // Add reset logic here
            alert('Account reset successfully');
        }
    });

    // Delete Account
    document.querySelector('.btn-delete')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            // Add delete logic here
            alert('Account deleted successfully');
        }
    });

    // Logout
    document.querySelector('.btn-logout')?.addEventListener('click', () => {
        // Add logout logic here
        window.location.href = 'index.html';
    });
});