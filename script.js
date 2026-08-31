'use strict';

document.documentElement.classList.add('is-enhanced');

function fallbackCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  return copied;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return fallbackCopy(text);
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const label = button.querySelector('.copy-label');
    const region = button.closest('.install-block, .cta-inner');
    const status = region ? region.querySelector('.copy-status') : null;
    const original = label.textContent;

    try {
      const copied = await copyText(button.dataset.copy);
      if (!copied) {
        throw new Error('Copy command was rejected.');
      }
      label.textContent = 'Copied';
      if (status) status.textContent = 'Install command copied to clipboard.';
    } catch {
      label.textContent = 'Select';
      if (status) status.textContent = 'Copy unavailable. Select the command text manually.';
    }

    window.setTimeout(() => {
      label.textContent = original;
      if (status) status.textContent = '';
    }, 2400);
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  for (const item of revealItems) item.classList.add('is-visible');
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  for (const item of revealItems) observer.observe(item);
}
