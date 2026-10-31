'use strict';

document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  menu.hidden = false;
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
}

const toast = document.querySelector('.toast');
const isEnglish = document.documentElement.lang === 'en';
const copyMessages = isEnglish
  ? {
      success: 'Address copied. Paste it into the Chrome address bar.',
      fallback: 'Copy this address manually: ',
    }
  : {
      success: 'Skopiowano adres. Wklej go do paska Chrome.',
      fallback: 'Skopiuj ręcznie adres: ',
    };
let toastTimer;
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    let message;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      message = copyMessages.success;
    } catch {
      message = copyMessages.fallback + value;
      const selection = window.getSelection();
      const code = button.querySelector('code');
      if (selection && code) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    if (toast) {
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('visible');
      toastTimer = setTimeout(() => toast.classList.remove('visible'), 6000);
    }
  });
});
