// Lightweight client-side behavior for signup/signin pages with validation, errors & success toast
document.addEventListener('DOMContentLoaded', () => {
  const signup = document.getElementById('signupForm');
  const signin = document.getElementById('signinForm');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---- helpers for validation/errors (unchanged) ---- */
  function createErrorEl(message) {
    const el = document.createElement('div');
    el.className = 'error-message';
    el.role = 'alert';
    el.innerText = message;
    return el;
  }
  function showError(input, message) {
    clearError(input);
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    const errorEl = createErrorEl(message);
    errorEl.id = `${input.id || input.name}-error`;
    input.setAttribute('aria-describedby', errorEl.id);
    const parent = input.closest('.field') || input.parentNode;
    parent.appendChild(errorEl);
  }
  function clearError(input) {
    if (!input) return;
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    const described = input.getAttribute('aria-describedby');
    if (described) {
      const prev = document.getElementById(described);
      if (prev) prev.remove();
      input.removeAttribute('aria-describedby');
    } else {
      const parent = input.closest('.field') || input.parentNode;
      const existing = parent.querySelector('.error-message');
      if (existing) existing.remove();
    }
  }

  function validateEmailInput(input) {
    const val = (input.value || '').trim();
    if (!val) {
      showError(input, 'Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(val)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    return true;
  }
  function validatePasswordInput(input) {
    const val = (input.value || '').trim();
    if (!val) {
      showError(input, 'Please enter a password.');
      return false;
    }
    if (val.length < 8) {
      showError(input, 'Password must be at least 8 characters.');
      return false;
    }
    return true;
  }
  function attachLiveValidation(form) {
    const inputs = form.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    inputs.forEach(inp => {
      inp.addEventListener('input', () => clearError(inp));
      inp.addEventListener('blur', () => {
        if (inp.type === 'email') validateEmailInput(inp);
        if (inp.type === 'password') validatePasswordInput(inp);
      });
    });
  }

  /* ---- success toast helper ---- */
  function showSuccess(message = 'Success') {
    // remove any existing toast first
    const prev = document.querySelector('.auth-success');
    if (prev) prev.remove();

    const toast = document.createElement('div');
    toast.className = 'auth-success';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerText = message;
    document.body.appendChild(toast);

    // auto-hide
    window.setTimeout(() => {
      toast.classList.add('auth-success--hide');
      window.setTimeout(() => toast.remove(), 350);
    }, 1800);
  }

  /* ---- signup handler ---- */
  if (signup) {
    attachLiveValidation(signup);
    signup.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = signup.querySelector('input[name="email"]');
      const pwdInput = signup.querySelector('input[name="password"]');

      clearError(emailInput);
      clearError(pwdInput);

      const okEmail = validateEmailInput(emailInput);
      const okPwd = validatePasswordInput(pwdInput);

      if (!okEmail) { emailInput.focus(); return; }
      if (!okPwd) { pwdInput.focus(); return; }

      // Show success toast then redirect
      showSuccess('Signed up successfully');
      // simulate async action, then redirect (adjust target as needed)
      setTimeout(() => window.location.href = 'index.html', 900);
    });
  }

  /* ---- signin handler ---- */
  if (signin) {
    attachLiveValidation(signin);
    signin.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = signin.querySelector('input[name="email"]');
      const pwdInput = signin.querySelector('input[name="password"]');

      clearError(emailInput);
      clearError(pwdInput);

      const okEmail = validateEmailInput(emailInput);
      const okPwd = validatePasswordInput(pwdInput);

      if (!okEmail) { emailInput.focus(); return; }
      if (!okPwd) { pwdInput.focus(); return; }

      showSuccess('Signed in successfully');
      setTimeout(() => window.location.href = 'index.html', 900);
    });
  }

  // Google buttons — placeholder
  document.getElementById('googleSignUp')?.addEventListener('click', () =>
    alert('Google sign up not implemented in this demo.')
  );
  document.getElementById('googleSignIn')?.addEventListener('click', () =>
    alert('Google sign in not implemented in this demo.')
  );
});