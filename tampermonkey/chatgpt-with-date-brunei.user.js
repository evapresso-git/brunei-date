// ==UserScript==
// @name         ChatGPT with Date (Brunei Edition)
// @namespace    https://github.com/evapresso-git/brunei-date
// @version      1.1.0
// @description  Display ChatGPT message timestamps in Brunei regional format (DD/MM/YYYY, 24-hour, Asia/Brunei) with optional Hijri date.
// @author       evapresso-git
// @license      MIT
// @icon         https://evapresso-git.github.io/brunei-date/assets/brunei-date-icon.svg
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-end
// ==/UserScript==
(() => {
  'use strict';

  const CONFIG = {
    timezone: 'Asia/Brunei',
    locale: 'en-BN',
    showHijri: true
  };

  function formatGregorian(date) {
    return new Intl.DateTimeFormat(CONFIG.locale, {
      timeZone: CONFIG.timezone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  }

  function formatHijri(date) {
    return (
      new Intl.DateTimeFormat('en-u-ca-islamic', {
        timeZone: CONFIG.timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date) + ' AH'
    );
  }

  function createTimeTag(date) {
    const container = document.createElement('div');
    container.style.cssText = `
      margin-top: 4px;
      font-size: 0.75rem;
      color: #9ca3af;
      text-align: right;
    `;

    const g = document.createElement('div');
    g.textContent = formatGregorian(date);
    container.appendChild(g);

    if (CONFIG.showHijri) {
      const h = document.createElement('div');
      h.style.opacity = '0.85';
      h.textContent = formatHijri(date);
      container.appendChild(h);
    }

    return container;
  }

  function processMessages() {
    document.querySelectorAll('article:not([data-brunei-time])')
      .forEach(msg => {
        msg.setAttribute('data-brunei-time', 'true');
        msg.appendChild(createTimeTag(new Date()));
      });
  }

  new MutationObserver(processMessages)
    .observe(document.body, { childList: true, subtree: true });

  processMessages();
})();
