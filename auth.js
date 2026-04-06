/* ═══════════════════════════════════════════════
   AUTH.JS — DevMatch Authentication System
   Uses localStorage for persistence (no backend)
═══════════════════════════════════════════════ */

const Auth = (() => {
  const USERS_KEY = 'devmatch_users';
  const SESSION_KEY = 'devmatch_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function hashPassword(pass) {
    // Simple deterministic hash (not cryptographic — for demo purposes)
    let h = 0;
    for (let i = 0; i < pass.length; i++) {
      h = Math.imul(31, h) + pass.charCodeAt(i) | 0;
    }
    return h.toString(36);
  }

  function register({ name, email, password, role, exp, domain }) {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: role || 'Full Stack',
      exp: exp || 'Intermediate',
      domain: domain || 'Open Innovation',
      goal: 'Win 🏆',
      avail: 'Full-time',
      bio: `Hi, I'm ${name}! Looking for passionate teammates to build something amazing.`,
      skills: [],
      color: 'linear-gradient(135deg,#6c63ff,#f472b6)',
      createdAt: Date.now(),
    };
    users.push(user);
    saveUsers(users);
    startSession(user);
    return { ok: true, user };
  }

  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return { ok: false, error: 'No account found with this email.' };
    if (user.passwordHash !== hashPassword(password)) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }
    startSession(user);
    return { ok: true, user };
  }

  function loginAsGuest() {
    const guest = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@devmatch.app',
      role: 'Full Stack',
      exp: 'Intermediate',
      domain: 'Open Innovation',
      goal: 'Learn',
      avail: 'Part-time',
      bio: 'Exploring DevMatch as a guest.',
      skills: ['React', 'Node.js'],
      color: 'linear-gradient(135deg,#6c63ff,#f472b6)',
      isGuest: true,
    };
    startSession(guest);
    return { ok: true, user: guest };
  }

  function startSession(user) {
    const session = { userId: user.id, user, loginAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch { return null; }
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    // For guest, return directly from session
    if (session.user?.isGuest) return session.user;
    // For real users, get fresh data from users store
    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  function updateProfile(updates) {
    const user = getCurrentUser();
    if (!user || user.isGuest) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;
    Object.assign(users[idx], updates);
    saveUsers(users);
    // Refresh session
    startSession(users[idx]);
  }

  return { register, login, loginAsGuest, logout, getCurrentUser, isLoggedIn, updateProfile };
})();

/* ═══════════════════════════════════════════════
   LOGIN PAGE FUNCTIONS
═══════════════════════════════════════════════ */

function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('login-form').style.display = isLogin ? '' : 'none';
  document.getElementById('register-form').style.display = isLogin ? 'none' : '';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-register').classList.toggle('active', !isLogin);
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.err-msg').forEach(e => {
    e.classList.remove('show');
    e.textContent = '';
  });
  document.querySelectorAll('.fi').forEach(f => f.classList.remove('err'));
}

function showFieldError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) field.classList.add('err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function showGlobalError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div>';
  } else {
    btn.innerHTML = btn.dataset.orig || btn.innerHTML;
  }
}

function handleLogin(e) {
  e.preventDefault();
  clearErrors();
  const email = document.getElementById('l-email').value.trim();
  const pass = document.getElementById('l-pass').value;
  let valid = true;
  if (!email) { showFieldError('l-email', 'l-email-err', 'Email is required'); valid = false; }
  if (!pass) { showFieldError('l-pass', 'l-pass-err', 'Password is required'); valid = false; }
  if (!valid) return;

  setLoading('login-btn', true);
  // Simulate async (localStorage is sync but UX feels better)
  setTimeout(() => {
    const result = Auth.login(email, pass);
    setLoading('login-btn', false);
    if (result.ok) {
      toast('🎉', `Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
      setTimeout(() => window.location.href = 'devmatch.html', 800);
    } else {
      showGlobalError('l-global-err', result.error);
    }
  }, 400);
}

function handleRegister(e) {
  e.preventDefault();
  clearErrors();
  const name = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const pass = document.getElementById('r-pass').value;
  const pass2 = document.getElementById('r-pass2').value;
  const role = document.getElementById('r-role').value;
  const exp = document.getElementById('r-exp').value;
  const domain = document.getElementById('r-domain').value;
  let valid = true;

  if (!name || name.length < 2) { showFieldError('r-name', 'r-name-err', 'Enter your full name'); valid = false; }
  if (!email) { showFieldError('r-email', 'r-email-err', 'Email is required'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('r-email', 'r-email-err', 'Enter a valid email'); valid = false; }
  if (!pass || pass.length < 8) { showFieldError('r-pass', 'r-pass-err', 'Password must be at least 8 characters'); valid = false; }
  if (pass !== pass2) { showFieldError('r-pass2', 'r-pass2-err', 'Passwords do not match'); valid = false; }
  if (!role) { showFieldError('r-role', 'r-global-err', 'Select your preferred role'); valid = false; }
  if (!valid) return;

  setLoading('register-btn', true);
  setTimeout(() => {
    const result = Auth.register({ name, email, password: pass, role, exp, domain });
    setLoading('register-btn', false);
    if (result.ok) {
      toast('🚀', 'Account created! Redirecting…', 'success');
      setTimeout(() => window.location.href = 'devmatch.html', 900);
    } else {
      showGlobalError('r-global-err', result.error);
    }
  }, 400);
}

function handleGuestLogin() {
  Auth.loginAsGuest();
  toast('👋', 'Continuing as guest…', 'info');
  setTimeout(() => window.location.href = 'devmatch.html', 700);
}

function checkStrength(pass) {
  const fill = document.getElementById('strength-fill');
  const lbl = document.getElementById('strength-lbl');
  if (!fill || !lbl) return;
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  const levels = [
    { w: '0%', c: 'transparent', t: '' },
    { w: '25%', c: '#f87171', t: 'Weak' },
    { w: '50%', c: '#fbbf24', t: 'Fair' },
    { w: '75%', c: '#38bdf8', t: 'Good' },
    { w: '100%', c: '#34d399', t: 'Strong' },
  ];
  const lvl = levels[score] || levels[0];
  fill.style.width = lvl.w;
  fill.style.background = lvl.c;
  lbl.textContent = lvl.t;
  lbl.style.color = lvl.c;
}

/* ═══════════════════════════════════════════════
   BACKGROUND EFFECTS (shared)
═══════════════════════════════════════════════ */
function initBgEffects() {
  const c = document.getElementById('bg-canvas');
  if (!c) return;
  [
    { bg: '#6c63ff', l: '-15%', t: '-10%', s: '500px', dur: '20s', tx: '60px', ty: '50px' },
    { bg: '#f472b6', r: '-10%', b: '-10%', s: '450px', dur: '25s', tx: '-50px', ty: '-60px' },
    { bg: '#38bdf8', l: '40%', t: '15%', s: '280px', dur: '16s', tx: '30px', ty: '20px' },
  ].forEach(o => {
    const d = document.createElement('div');
    d.className = 'orb';
    d.style.cssText = `width:${o.s};height:${o.s};background:${o.bg};${o.l ? 'left:' + o.l : 'right:' + o.r};${o.t ? 'top:' + o.t : 'bottom:' + o.b};--dur:${o.dur};--tx:${o.tx};--ty:${o.ty}`;
    c.appendChild(d);
  });
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div'); s.className = 'star';
    const sz = Math.random() * 2 + .5;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:#fff;--d:${2 + Math.random() * 5}s;--o:${.15 + Math.random() * .5};animation-delay:${Math.random() * 6}s`;
    c.appendChild(s);
  }
}

/* ═══════════════════════════════════════════════
   TOAST (shared)
═══════════════════════════════════════════════ */
function toast(icon, msg, type = 'success') {
  const c = document.getElementById('toast-wrap');
  if (!c) return;
  const colors = { success: '#34d399', info: '#38bdf8', warning: '#fbbf24', error: '#f87171' };
  const col = colors[type] || colors.info;
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<div class="t-ico" style="background:${col}22;color:${col}">${icon}</div><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
}
