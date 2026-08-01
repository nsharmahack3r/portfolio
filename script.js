(() => {
  'use strict';

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) root.setAttribute('data-theme', storedTheme);

  themeToggle.addEventListener('click', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll progress bar
  const progressBar = document.getElementById('progressBar');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Back to top
  const toTop = document.getElementById('toTop');
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Ask AI
  const PROFILE_URL = 'https://nabhya.dartbucket.com/';
  const ASK_PROMPT = `I'd like to learn about Nabhya Sharma, a full-stack engineer (Flutter, Node.js, AI & computer vision). Please look up and read ${PROFILE_URL}, then give me a concise summary of their background, skills, and experience. I'll ask follow-up questions after that.`;

  const AI_TARGETS = {
    perplexity: (q) => `https://www.perplexity.ai/search?q=${q}`,
    claude: (q) => `https://claude.ai/new?q=${q}`,
    chatgpt: (q) => `https://chatgpt.com/?q=${q}`,
    grok: () => 'https://grok.com',
  };

  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  document.querySelectorAll('.ai-card').forEach((card) => {
    card.addEventListener('click', () => {
      const buildUrl = AI_TARGETS[card.dataset.ai];
      if (!buildUrl) return;

      const url = buildUrl(encodeURIComponent(ASK_PROMPT));
      window.open(url, '_blank', 'noopener,noreferrer');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(ASK_PROMPT)
          .then(() => showToast('Prompt copied — paste it if the chat opens empty.'))
          .catch(() => showToast('Opened in a new tab — copy the prompt manually if needed.'));
      } else {
        showToast('Opened in a new tab — copy the prompt manually if needed.');
      }
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
