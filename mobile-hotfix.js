/* Lifeskills Orientation button reliability hotfix */
(() => {
  'use strict';

  function hideOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.style.pointerEvents = 'none';
  }

  function showOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.style.pointerEvents = 'auto';
    overlay.style.display = 'flex';
    const panel = overlay.querySelector('.panel');
    if (panel) panel.scrollTop = 0;
  }

  document.addEventListener('DOMContentLoaded', () => {
    /* Prevent initially hidden overlays from sitting over the page on mobile. */
    ['clue-overlay', 'certificate-overlay', 'guide-overlay', 'timeup-overlay', 'loading-overlay']
      .forEach(id => {
        const overlay = document.getElementById(id);
        if (overlay && getComputedStyle(overlay).display === 'none') {
          overlay.style.pointerEvents = 'none';
        }
      });

    const certificateButton = document.getElementById('recall-certificate-btn');
    if (certificateButton) {
      certificateButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (certificateButton.disabled) return;
        if (typeof window.showCertificate === 'function') window.showCertificate();
        showOverlay('certificate-overlay');
      }, true);
    }

    const certificateClose = document.querySelector('#certificate button');
    if (certificateClose) {
      certificateClose.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        hideOverlay('certificate-overlay');
      }, true);
    }

    const restartButton = document.getElementById('restart-btn');
    if (restartButton) {
      restartButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const confirmed = window.confirm('Restart the game? Team details, timer and all mission progress on this device will be cleared.');
        if (!confirmed) return;
        ['team','className','currentStage','unlockedStage','scoreboard','locationOrder','gameStartTime','gameTimeUpShown']
          .forEach(key => localStorage.removeItem(key));
        window.location.reload();
      }, true);
    }

    /* Restore pointer handling whenever existing code opens a dialog. */
    const observer = new MutationObserver(records => {
      for (const record of records) {
        const el = record.target;
        if (!el.classList || !el.classList.contains('overlay')) continue;
        el.style.pointerEvents = getComputedStyle(el).display === 'none' ? 'none' : 'auto';
      }
    });
    document.querySelectorAll('.overlay').forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['style'] }));
  });
})();
