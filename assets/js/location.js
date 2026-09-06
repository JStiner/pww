(() => {
  const STORAGE_KEY = 'pww-shipping-zip';
  const params = new URLSearchParams(location.search);
  const isCart = params.get('view') === 'cart';

  const getZip = () => {
    const value = (localStorage.getItem(STORAGE_KEY) || '').trim();
    return /^\d{5}$/.test(value) ? value : '';
  };

  const setZip = value => {
    const zip = String(value || '').replace(/\D/g, '').slice(0, 5);
    if (!/^\d{5}$/.test(zip)) return false;
    localStorage.setItem(STORAGE_KEY, zip);
    updateLocationUI();
    return true;
  };

  const shippingSummaryText = zip => zip
    ? `ZIP ${zip} set — live rate calculation pending`
    : 'Set ZIP to estimate shipping';

  const updateLocationUI = () => {
    const zip = getZip();
    const label = document.getElementById('shipping-location-label');
    if (label) label.textContent = zip ? `Ship to ${zip}` : 'Set ZIP code';

    document.querySelectorAll('[data-current-shipping-zip]').forEach(el => {
      el.textContent = zip || 'Not set';
    });

    document.querySelectorAll('.summary-line').forEach(row => {
      const labelEl = row.querySelector('span');
      const valueEl = row.querySelector('strong');
      if (labelEl && valueEl && labelEl.textContent.trim() === 'Shipping / pickup') {
        valueEl.textContent = shippingSummaryText(zip);
      }
    });
  };

  const ensureModal = () => {
    let modal = document.getElementById('shipping-zip-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'shipping-zip-modal';
    modal.className = 'zip-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="zip-modal-backdrop" data-close-zip></div>
      <section class="zip-dialog" role="dialog" aria-modal="true" aria-labelledby="zip-dialog-title">
        <button class="zip-dialog-close" type="button" aria-label="Close" data-close-zip>&times;</button>
        <div class="zip-dialog-kicker">Shipping location</div>
        <h2 id="zip-dialog-title">Enter your ZIP code</h2>
        <p>Set a delivery location now so P&amp;W can add shipping cost, product availability and delivery options later.</p>
        <form id="shipping-zip-form" class="zip-form">
          <label for="shipping-zip-input">ZIP code</label>
          <div class="zip-form-row">
            <input id="shipping-zip-input" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" pattern="[0-9]{5}" placeholder="62530" required>
            <button class="btn" type="submit">Set ZIP</button>
          </div>
          <div class="zip-error" id="shipping-zip-error" role="alert"></div>
        </form>
        <div class="zip-poc-note">POC only — no shipping rate lookup is being performed yet.</div>
      </section>`;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-close-zip]').forEach(el => el.addEventListener('click', closeModal));
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    modal.querySelector('#shipping-zip-form').addEventListener('submit', e => {
      e.preventDefault();
      const input = modal.querySelector('#shipping-zip-input');
      const error = modal.querySelector('#shipping-zip-error');
      if (!setZip(input.value)) {
        error.textContent = 'Enter a valid 5-digit ZIP code.';
        input.focus();
        return;
      }
      error.textContent = '';
      closeModal();
    });
    return modal;
  };

  function openModal() {
    const modal = ensureModal();
    const input = modal.querySelector('#shipping-zip-input');
    input.value = getZip();
    modal.hidden = false;
    document.body.classList.add('zip-modal-open');
    requestAnimationFrame(() => input.focus());
  }

  function closeModal() {
    const modal = document.getElementById('shipping-zip-modal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('zip-modal-open');
  }

  const ensureCartLocation = () => {
    if (!isCart) return;
    const wrap = document.querySelector('#app .page-wrap');
    const heading = wrap?.querySelector('.section-heading');
    if (!wrap || !heading) return;

    let panel = wrap.querySelector('.cart-shipping-location');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'cart-shipping-location';
      heading.insertAdjacentElement('afterend', panel);
    }

    const zip = getZip();
    panel.innerHTML = `
      <div class="cart-shipping-copy">
        <span class="cart-shipping-kicker">Shipping location</span>
        <strong>${zip ? `Ship to ${zip}` : 'Set your ZIP code'}</strong>
        <span>${zip ? 'Ready for future shipping-rate and delivery calculations.' : 'Enter a ZIP now so shipping estimates can be added later.'}</span>
      </div>
      <button class="btn small outline" type="button" data-set-shipping-zip>${zip ? 'Change ZIP' : 'Set ZIP'}</button>`;

    updateLocationUI();
  };

  document.addEventListener('click', e => {
    if (e.target.closest('#shipping-location-control, [data-set-shipping-zip]')) {
      e.preventDefault();
      openModal();
    }
  });

  if (isCart) {
    const observer = new MutationObserver(() => {
      if (!document.querySelector('#app .cart-shipping-location')) ensureCartLocation();
      updateLocationUI();
    });
    observer.observe(document.getElementById('app'), { childList: true, subtree: true });
  }

  ensureCartLocation();
  updateLocationUI();
})();