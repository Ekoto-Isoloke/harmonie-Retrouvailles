document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorBox = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const btn = loginForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Connexion...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }

      const data = await response.json();
      localStorage.setItem('hr_token', data.token);
      localStorage.setItem('hr_user', JSON.stringify(data.user));

      const role = data.user.role.toLowerCase();
      
      if (role === 'parent') {
        window.location.href = '/parent-dashboard.html';
      } else if (role === 'comptable') {
        window.location.href = '/compta-dashboard.html';
      } else if (role === 'enseignant' || role === 'agent') {
        window.location.href = '/rh-dashboard.html';
      } else {
        // Fallback for admins or others
        window.location.href = '/'; 
      }
    } catch (error) {
      errorBox.classList.remove('hidden');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
});
