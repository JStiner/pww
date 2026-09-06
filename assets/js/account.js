(() => {
  const params = new URLSearchParams(location.search);
  const view = params.get('view') || 'home';
  const app = document.getElementById('app');
  const zip = () => (localStorage.getItem('pww-shipping-zip') || '').trim();

  const accountLink = document.getElementById('customer-account-link');
  if (accountLink) {
    accountLink.innerHTML = '<span>Account</span><strong>Sign In / Register</strong>';
  }

  const accountBreadcrumb = '<div class="breadcrumb"><a href="./">Home</a> &nbsp;/&nbsp; Account</div>';

  function renderAuth() {
    if (!app) return;
    app.innerHTML = `
      <div class="shell account-page">
        ${accountBreadcrumb}
        <div class="account-header">
          <div><h1>My P&amp;W Account</h1><p>Manage orders, addresses, shipping location and account details.</p></div>
        </div>
        <div class="account-auth-grid">
          <section class="account-panel">
            <h2>Sign In</h2>
            <p>Returning customers will use this form once Supabase authentication is connected.</p>
            <form class="account-form" id="account-signin-form">
              <label>Email address<input type="email" autocomplete="email" required placeholder="you@example.com"></label>
              <label>Password<input type="password" autocomplete="current-password" required placeholder="Password"></label>
              <button class="btn" type="submit">Sign In</button>
            </form>
            <div class="account-helper">POC only — credentials are not stored or transmitted.</div>
            <ul class="account-benefits"><li>View order history and order status</li><li>Save shipping and billing addresses</li><li>Keep your preferred shipping ZIP</li><li>Save contact information for faster checkout</li></ul>
          </section>
          <section class="account-panel">
            <h2>Create an Account</h2>
            <p>Customer registration will become a Supabase Auth signup flow in production.</p>
            <form class="account-form" id="account-register-form">
              <label>First name<input autocomplete="given-name" required></label>
              <label>Last name<input autocomplete="family-name" required></label>
              <label>Email address<input type="email" autocomplete="email" required></label>
              <label>Password<input type="password" autocomplete="new-password" required></label>
              <button class="btn" type="submit">Create Account</button>
            </form>
            <div class="account-helper">No account is created in this POC.</div>
            <button class="btn outline" id="preview-account" type="button" style="width:100%;margin-top:14px">Preview Signed-In Account</button>
          </section>
        </div>
      </div>`;

    document.getElementById('account-signin-form')?.addEventListener('submit', e => {
      e.preventDefault();
      alert('POC only: Supabase Auth will handle sign-in here.');
    });
    document.getElementById('account-register-form')?.addEventListener('submit', e => {
      e.preventDefault();
      alert('POC only: Supabase Auth will create the customer account here.');
    });
    document.getElementById('preview-account')?.addEventListener('click', renderDashboard);
  }

  function renderDashboard() {
    if (!app) return;
    const currentZip = zip() || 'Not set';
    app.innerHTML = `
      <div class="shell account-page">
        ${accountBreadcrumb}
        <div class="account-demo-banner"><div><strong>Demo customer account</strong><span>This is a visual preview only. No authentication or customer data is connected yet.</span></div><button class="btn small outline" id="exit-account-preview" type="button">Exit Preview</button></div>
        <div class="account-header"><div><h1>Welcome back</h1><p>Customer account dashboard preview.</p></div></div>
        <div class="account-dashboard">
          <nav class="account-sidebar" aria-label="Account sections">
            <button class="active" type="button">Account Overview</button>
            <button type="button">Orders</button>
            <button type="button">Addresses</button>
            <button type="button">Profile</button>
          </nav>
          <main class="account-main">
            <section class="account-summary-grid">
              <article class="account-summary-card"><h2>Orders</h2><strong>0 current orders</strong><p>Online and synced QuickBooks order history can appear here later.</p><button type="button">View orders</button></article>
              <article class="account-summary-card"><h2>Shipping Location</h2><strong>${currentZip}</strong><p>Your saved ZIP can drive future shipping rates and delivery availability.</p><button type="button" data-set-shipping-zip>${currentZip === 'Not set' ? 'Set ZIP' : 'Change ZIP'}</button></article>
              <article class="account-summary-card"><h2>Saved Addresses</h2><strong>0 addresses</strong><p>Shipping and billing addresses will be stored in the customer profile.</p><button type="button">Manage addresses</button></article>
            </section>
            <section class="account-section">
              <div class="account-section-head"><h2>Recent Orders</h2></div>
              <div class="account-section-body"><div class="account-empty">No POC orders are tied to an account yet. Future online orders can be synced back to QuickBooks and shown here.</div></div>
            </section>
            <section class="account-section">
              <div class="account-section-head"><h2>Account Details</h2><button class="btn small outline" type="button">Edit</button></div>
              <div class="account-section-body">
                <dl class="account-detail-list"><dt>Name</dt><dd>Demo Customer</dd><dt>Email</dt><dd>customer@example.com</dd><dt>Phone</dt><dd>Not set</dd><dt>Preferred ZIP</dt><dd>${currentZip}</dd></dl>
              </div>
            </section>
          </main>
        </div>
      </div>`;
    document.getElementById('exit-account-preview')?.addEventListener('click', renderAuth);
  }

  function addCartAccountPrompt() {
    if (view !== 'cart' || !app) return;
    const heading = app.querySelector('.section-heading');
    if (!heading || app.querySelector('.cart-account-prompt')) return;
    const prompt = document.createElement('div');
    prompt.className = 'cart-account-prompt';
    prompt.innerHTML = '<div><strong>Have a P&amp;W account?</strong><span>Sign in later for saved addresses, order history and faster checkout.</span></div><a class="btn small outline" href="./?view=account">Sign In</a>';
    heading.insertAdjacentElement('afterend', prompt);
  }

  if (view === 'account') {
    renderAuth();
  } else if (view === 'cart') {
    const observer = new MutationObserver(addCartAccountPrompt);
    observer.observe(app, {childList:true,subtree:true});
    addCartAccountPrompt();
  }
})();