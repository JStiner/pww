(() => {
  const data = window.PWW_DATA;
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const view = params.get('view') || 'home';

  const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = n => n == null ? 'Request a quote' : `$${Number(n).toLocaleString('en-US',{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2})}`;
  const link = (path, label) => `<a href="${path}">${label}</a>`;
  const crumb = (label) => `<div class="breadcrumb">${link('./','Home')} &nbsp;/&nbsp; ${esc(label)}</div>`;

  window.pwwImageFallback = img => {
    const fallback = img.dataset.fallback;
    if (fallback && img.src !== fallback) { img.onerror = null; img.src = fallback; }
  };

  const image = (item, alt = item.name || '') => `<img class="loading-img" src="${esc(item.image)}" data-fallback="${esc(item.fallback || '')}" alt="${esc(alt)}" onerror="window.pwwImageFallback(this)">`;

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem('pww-cart') || '[]'); }
    catch { return []; }
  };
  const saveCart = cart => { localStorage.setItem('pww-cart', JSON.stringify(cart)); updateCartCount(); };
  const updateCartCount = () => {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = getCart().reduce((sum,item)=>sum+(item.qty||1),0);
  };
  const toast = message => {
    document.querySelector('.toast')?.remove();
    const el = document.createElement('div'); el.className='toast'; el.textContent=message; document.body.appendChild(el);
    setTimeout(()=>el.remove(),2200);
  };
  const addToCart = id => {
    const product = data.products.find(p=>p.id===id); if (!product) return;
    const cart = getCart(); const existing = cart.find(i=>i.id===id);
    if (existing) existing.qty += 1; else cart.push({id,qty:1});
    saveCart(cart); toast(`${product.name} added to POC cart`);
  };

  const productCard = p => `
    <article class="product-card">
      ${p.badge?`<span class="badge">${esc(p.badge)}</span>`:''}
      <a class="product-image" href="./?view=product&id=${encodeURIComponent(p.id)}">${image(p,p.name)}</a>
      <div class="product-brand">${esc(p.brand)}</div>
      <a class="product-name" href="./?view=product&id=${encodeURIComponent(p.id)}">${esc(p.name)}</a>
      <div class="product-price">${money(p.demoPrice)}${p.demoPrice!=null?'<span class="demo-label">Demonstration price</span>':''}</div>
      <div class="availability">${esc(p.availability)}</div>
      <div class="product-actions">
        <button class="btn small" data-add="${esc(p.id)}">${p.demoPrice==null?'Add to Quote':'Add to Cart'}</button>
        <a class="btn small outline" href="./?view=product&id=${encodeURIComponent(p.id)}">Details</a>
      </div>
    </article>`;

  function renderHome(){
    const cats = data.categories.map(c=>`<a class="category-tile" href="./?view=shop&category=${encodeURIComponent(c.name)}">${image(c,c.name)}<span>${esc(c.name)}</span></a>`).join('');
    const products = data.products.slice(0,10).map(productCard).join('');
    app.innerHTML = `<div class="shell page-wrap">
      <section class="hero-grid" aria-label="Featured">
        <div class="hero-main image-darken">
          ${image({image:'assets/img/inventory/hot-water-washers.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/063-1920w.jpg'},'Pressure Washer Warehouse equipment showroom')}
          <div class="hero-copy"><h1>Wash Smarter,<br>Not Harder.</h1><p>Commercial pressure washers, parts and equipment backed by local service in Divernon, Illinois.</p><a class="btn light" href="./?view=shop">Shop Equipment</a></div>
        </div>
        <div class="hero-stack">
          <div class="hero-side image-darken">${image({image:'assets/img/inventory/surface-cleaners.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/053-1920w.jpg'},'Pressure washer surface cleaners')}<div class="hero-copy"><h2>Parts &amp; Accessories</h2><p>Hoses, reels, wands, cleaners and more.</p><a class="btn small light" href="./?view=shop&category=Parts%20%26%20Accessories">Shop Parts</a></div></div>
          <div class="hero-side image-darken">${image({image:'assets/img/inventory/stor-loc-black.jpg',fallback:'https://lirp.cdn-website.com/a2f396c011224f74b50782821a251211/dms3rep/multi/opt/067-1920w.jpg'},'Stor-Loc modular tool storage')}<div class="hero-copy"><h2>Stor-Loc Tool Storage</h2><p>Heavy-duty modular storage built for serious work.</p><a class="btn small light" href="./?view=shop&category=Tool%20Storage">Explore Stor-Loc</a></div></div>
        </div>
      </section>

      <div class="service-strip">
        <a class="service-item" href="./?view=service"><strong>Full Parts &amp; Service</strong><span>On-site pressure washer service department</span></a>
        <a class="service-item" href="./?view=service#hydraulic"><strong>Hydraulic Hose Repair</strong><span>Eaton hydraulic hose products</span></a>
        <a class="service-item" href="./?view=rentals"><strong>Equipment Rentals</strong><span>Rental service available from P&amp;W</span></a>
        <a class="service-item" href="./?view=contact"><strong>Talk to a Real Person</strong><span>217-628-3850 · Divernon, IL</span></a>
      </div>

      <div class="section-heading"><h2>Shop by Department</h2><a href="./?view=shop">Shop All</a></div>
      <section class="category-grid">${cats}</section>

      <div class="section-heading"><h2>Featured Equipment &amp; Parts</h2><a href="./?view=shop">View All Products</a></div>
      <section class="product-grid">${products}</section>

      <section class="promo-row">
        <div class="promo-panel">${image({image:'assets/img/inventory/showroom.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/050-1920w.jpg'},'P&W showroom')}<div class="hero-copy"><h2>Sales · Service · Parts · Rentals</h2><p>P&amp;W has served Central Illinois from its Divernon location since moving there in 2004.</p><a class="btn small light" href="./?view=about">Our Story</a></div></div>
        <div class="promo-panel">${image({image:'assets/img/inventory/air-compressors.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/052-1920w.jpg'},'Commercial equipment at P&W')}<div class="hero-copy"><h2>More Than Pressure Washers</h2><p>Air compressors, heaters, generators, trash pumps, water treatment and tool storage.</p><a class="btn small light" href="./?view=shop&category=Equipment">Shop Equipment</a></div></div>
      </section>

      <div class="section-heading"><h2>Brands &amp; Product Lines</h2></div>
      <section class="brand-row"><div class="brand-box">Mi-T-M</div><div class="brand-box">Kärcher</div><div class="brand-box">Stor-Loc</div><div class="brand-box">Eaton</div></section>
    </div>`;
  }

  function renderShop(){
    const q = (params.get('q')||'').trim().toLowerCase();
    const selectedCat = params.get('category')||'All';
    const selectedBrand = params.get('brand')||'All';
    const sort = params.get('sort')||'featured';
    let results = data.products.filter(p => (selectedCat==='All'||p.category===selectedCat) && (selectedBrand==='All'||p.brand===selectedBrand) && (!q || `${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.summary}`.toLowerCase().includes(q)));
    if(sort==='price-low') results.sort((a,b)=>(a.demoPrice??999999)-(b.demoPrice??999999));
    if(sort==='price-high') results.sort((a,b)=>(b.demoPrice??-1)-(a.demoPrice??-1));
    if(sort==='name') results.sort((a,b)=>a.name.localeCompare(b.name));
    const brands = [...new Set(data.products.map(p=>p.brand))].sort();
    const option = (value,current) => `<option value="${esc(value)}" ${value===current?'selected':''}>${esc(value)}</option>`;
    app.innerHTML = `<div class="shell page-wrap">${crumb('Shop')}
      <div class="section-heading"><h1>${q?`Search results for “${esc(params.get('q'))}”`:selectedCat==='All'?'Shop All Products':esc(selectedCat)}</h1></div>
      <div class="shop-layout">
        <aside class="filter-panel"><h2>Filter Products</h2>
          <div class="filter-group"><label for="category-filter"><strong>Department</strong></label><select id="category-filter">${option('All',selectedCat)}${data.categories.map(c=>option(c.name,selectedCat)).join('')}</select></div>
          <div class="filter-group"><label for="brand-filter"><strong>Brand</strong></label><select id="brand-filter">${option('All',selectedBrand)}${brands.map(b=>option(b,selectedBrand)).join('')}</select></div>
          <div class="filter-group"><label for="shop-search"><strong>Search within results</strong></label><input id="shop-search" value="${esc(params.get('q')||'')}" placeholder="Product, brand or type"></div>
        </aside>
        <section>
          <div class="results-toolbar"><strong>${results.length} result${results.length===1?'':'s'}</strong><label>Sort: <select id="sort-filter"><option value="featured" ${sort==='featured'?'selected':''}>Featured</option><option value="name" ${sort==='name'?'selected':''}>Name</option><option value="price-low" ${sort==='price-low'?'selected':''}>Price: Low to High</option><option value="price-high" ${sort==='price-high'?'selected':''}>Price: High to Low</option></select></label></div>
          ${results.length?`<div class="product-grid">${results.map(productCard).join('')}</div>`:`<div class="empty-state"><h2>No matching products</h2><p>Try another category, brand or search phrase.</p><a class="btn" href="./?view=shop">Clear Filters</a></div>`}
        </section>
      </div>
    </div>`;
    const apply = () => {
      const next = new URLSearchParams(); next.set('view','shop');
      const cat=document.getElementById('category-filter').value, brand=document.getElementById('brand-filter').value, text=document.getElementById('shop-search').value.trim(), sorting=document.getElementById('sort-filter').value;
      if(cat!=='All')next.set('category',cat); if(brand!=='All')next.set('brand',brand); if(text)next.set('q',text); if(sorting!=='featured')next.set('sort',sorting);
      location.href=`./?${next.toString()}`;
    };
    document.getElementById('category-filter').addEventListener('change',apply);
    document.getElementById('brand-filter').addEventListener('change',apply);
    document.getElementById('sort-filter').addEventListener('change',apply);
    document.getElementById('shop-search').addEventListener('keydown',e=>{if(e.key==='Enter')apply()});
  }

  function renderProduct(){
    const p=data.products.find(x=>x.id===params.get('id'));
    if(!p){app.innerHTML=`<div class="shell page-wrap">${crumb('Product')}<div class="empty-state"><h1>Product not found</h1><a class="btn" href="./?view=shop">Return to Shop</a></div></div>`;return;}
    const related=data.products.filter(x=>x.id!==p.id&&(x.category===p.category||x.brand===p.brand)).slice(0,5);
    app.innerHTML=`<div class="shell page-wrap">${crumb(`${p.category} / ${p.name}`)}
      <section class="product-detail">
        <div class="detail-gallery">${image(p,p.name)}</div>
        <div class="detail-info"><div class="eyebrow">${esc(p.brand)} · ${esc(p.subcategory)}</div><h1>${esc(p.name)}</h1>${p.badge?`<span class="badge-inline">${esc(p.badge)}</span>`:''}
          <div class="detail-price">${money(p.demoPrice)}${p.demoPrice!=null?'<span class="demo-label">Demonstration price — not live pricing</span>':''}</div>
          <div class="detail-stock"><strong>${esc(p.availability)}</strong><br><span>Divernon, Illinois · POC availability only</span></div>
          <p class="detail-summary">${esc(p.summary)}</p>
          <div class="detail-actions"><button class="btn" data-add="${esc(p.id)}">${p.demoPrice==null?'Add to Quote':'Add to Cart'}</button><a class="btn outline" href="tel:2176283850">Call 217-628-3850</a></div>
          <div class="notice"><strong>POC data:</strong> product names, photos and categories are based on P&amp;W’s current site. Pricing and inventory state shown here are demonstrations pending QuickBooks integration.</div>
          <div class="spec-list">${p.specs.map(s=>`<div>${esc(s)}</div>`).join('')}</div>
        </div>
      </section>
      ${related.length?`<div class="section-heading"><h2>You May Also Need</h2><a href="./?view=shop&category=${encodeURIComponent(p.category)}">Shop ${esc(p.category)}</a></div><div class="product-grid">${related.map(productCard).join('')}</div>`:''}
    </div>`;
  }

  function renderCart(){
    const cart=getCart(); const rows=cart.map(item=>({item,p:data.products.find(x=>x.id===item.id)})).filter(x=>x.p);
    const subtotal=rows.reduce((sum,x)=>sum+(x.p.demoPrice||0)*x.item.qty,0); const quoteCount=rows.filter(x=>x.p.demoPrice==null).length;
    app.innerHTML=`<div class="shell page-wrap">${crumb('Cart')}<div class="section-heading"><h1>Your POC Cart</h1></div>
      ${rows.length?`<div class="cart-layout"><div class="cart-items">${rows.map(({item,p})=>`<div class="cart-row">${image(p,p.name)}<div><div class="product-brand">${esc(p.brand)}</div><h3>${esc(p.name)}</h3><div>${esc(p.availability)}</div><div>Qty: ${item.qty}</div><button class="remove" data-remove="${esc(p.id)}">Remove</button></div><div><strong>${p.demoPrice==null?'Quote item':money(p.demoPrice*item.qty)}</strong>${p.demoPrice!=null?'<span class="demo-label">Demo price</span>':''}</div></div>`).join('')}</div>
      <aside class="order-summary"><h2>Order Summary</h2><div class="summary-line"><span>Demo-priced items</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Quote-only items</span><strong>${quoteCount}</strong></div><div class="summary-line"><span>Shipping / pickup</span><strong>Not configured</strong></div><div class="summary-line total"><span>POC subtotal</span><strong>${money(subtotal)}</strong></div><button class="btn gold" id="demo-checkout">Continue to Demo Checkout</button><p style="font-size:11px;color:#666">No payment will be collected. Live checkout will be designed after inventory and QuickBooks workflow decisions.</p></aside></div>`:`<div class="empty-state"><h2>Your cart is empty</h2><p>Add demonstration products to test the customer shopping flow.</p><a class="btn" href="./?view=shop">Shop Products</a></div>`}
    </div>`;
    document.getElementById('demo-checkout')?.addEventListener('click',()=>alert('POC only: this is where pickup/shipping selection and payment would begin after QuickBooks and payment integration are approved.'));
  }

  function renderAbout(){
    app.innerHTML=`<div class="shell page-wrap">${crumb('About P&W')}<section class="info-hero"><div class="info-copy"><h1>Pressure Washer Warehouse</h1><p>P&amp;W specializes in pressure washer sales, parts and service in Divernon, Illinois, with additional equipment including generators, air compressors and Stor-Loc tool storage.</p><p>The business began as Otter Lake Pump Company in Girard in 1997. After outgrowing that location, it moved to its current Divernon location in 2004 and became Pressure Washer Warehouse.</p><a class="btn" href="./?view=contact">Contact P&amp;W</a></div>${image({image:'assets/img/inventory/showroom.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/050-1920w.jpg'},'Pressure Washer Warehouse showroom')}</section>
      <div class="content-grid"><article class="content-card"><h2>Current Ownership</h2><p>Brett and Sharon Holzwarth took ownership July 1, 2016, with help from Chuck and Linda Holzwarth. The family had already been P&amp;W customers for more than a decade.</p></article><article class="content-card"><h2>Full-Service Location</h2><p>The Divernon warehouse includes a full parts and service department and supports sales, service, parts and rentals.</p></article><article class="content-card"><h2>Central Illinois</h2><p>P&amp;W serves customers across Central Illinois and surrounding areas, including Springfield, Decatur, Taylorville, Lincoln, Bloomington, Champaign and beyond.</p></article></div>
    </div>`;
  }

  function renderService(){
    app.innerHTML=`<div class="shell page-wrap">${crumb('Service')}<section class="info-hero"><div class="info-copy"><h1>Parts &amp; Service</h1><p>P&amp;W operates an on-site parts and service department for pressure-washing equipment. The retail POC is designed to connect product shopping directly to local service rather than treating service as a separate afterthought.</p><div class="detail-actions"><a class="btn" href="tel:2176283850">Call for Service</a><a class="btn outline" href="./?view=contact">Contact Us</a></div></div>${image({image:'assets/img/inventory/service-sign.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/948-360w.jpg'},'Service department sign')}</section>
      <div class="content-grid"><article class="content-card"><h2>Pressure Washer Service</h2><p>Support for the commercial pressure washer equipment P&amp;W sells, including access to replacement parts and local service.</p></article><article class="content-card"><h2>Replacement Parts</h2><p>Hoses, reels, wands and replacement-part categories can eventually be tied to QuickBooks inventory and machine compatibility.</p></article><article class="content-card" id="hydraulic"><h2>Hydraulic Hose Repair</h2><p>P&amp;W now offers hydraulic hose repair and carries Eaton hydraulic hose products.</p></article></div>
    </div>`;
  }

  function renderRentals(){
    app.innerHTML=`<div class="shell page-wrap">${crumb('Rentals')}<section class="info-hero"><div class="info-copy"><h1>Equipment Rentals</h1><p>P&amp;W’s current business includes a rental service. The production version can evolve this page into a real rental catalog with availability calendars once the rental inventory and business rules are confirmed.</p><div class="notice"><strong>POC scope:</strong> no rental rates or availability have been invented. Those fields should come from Bret’s actual rental list.</div><a class="btn" href="tel:2176283850">Call About Rentals</a></div>${image({image:'assets/img/inventory/pressure-washers.jpg',fallback:'https://irp.cdn-website.com//a2f396c011224f74b50782821a251211/dms3rep/multi/opt/064-1920w.jpg'},'Pressure washing equipment')}</section>
      <div class="content-grid"><article class="content-card"><h2>Future Online Reservation</h2><p>Customer selects equipment, dates and pickup details; P&amp;W confirms availability before payment or deposit.</p></article><article class="content-card"><h2>Inventory-Aware</h2><p>Rental availability should be separate from sale inventory so a rented machine cannot accidentally appear as retail stock.</p></article><article class="content-card"><h2>Local Pickup</h2><p>The Divernon location remains the operational center for pickup, support and returns.</p></article></div>
    </div>`;
  }

  function renderContact(){
    app.innerHTML=`<div class="shell page-wrap">${crumb('Contact')}<div class="section-heading"><h1>Contact Pressure Washer Warehouse</h1></div><div class="contact-grid"><section class="contact-card"><h2>Divernon, Illinois</h2><p><strong>Phone</strong><br><a href="tel:2176283850">217-628-3850</a></p><p><strong>Email</strong><br><a href="mailto:sales@pwwillinois.com">sales@pwwillinois.com</a></p><p><strong>Address</strong><br>14272 Frazee Rd.<br>Divernon, IL 62530</p><p><strong>Hours shown on P&amp;W’s primary current-site contact block</strong><br>Mon–Fri: 8:00 AM–6:00 PM<br>Saturday: 8:00 AM–2:00 PM<br>Sunday: Closed</p><div class="notice">The current P&amp;W site contains a second conflicting hours block showing Mon–Fri 8–5 and weekends closed. Confirm the correct hours with Bret before production.</div></section><section class="contact-card"><h2>Send a Message</h2><form id="contact-demo" class="form-grid"><label>Full Name<input required></label><label>Phone<input type="tel"></label><label class="full">Email<input type="email" required></label><label class="full">Subject<input></label><label class="full">Message<textarea required></textarea></label><div class="full"><button class="btn" type="submit">Send Demo Message</button></div></form><p style="font-size:11px;color:#666">POC form only. No message is transmitted.</p></section></div></div>`;
    document.getElementById('contact-demo').addEventListener('submit',e=>{e.preventDefault();alert('POC only: the production contact form will route to P&W after the email workflow is approved.')});
  }

  const renderers={home:renderHome,shop:renderShop,product:renderProduct,cart:renderCart,about:renderAbout,service:renderService,rentals:renderRentals,contact:renderContact};
  (renderers[view]||renderHome)();

  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]'); if(add){e.preventDefault();addToCart(add.dataset.add);}
    const remove=e.target.closest('[data-remove]'); if(remove){const cart=getCart().filter(i=>i.id!==remove.dataset.remove);saveCart(cart);renderCart();}
  });

  document.getElementById('global-search').addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('global-search-input').value.trim();location.href=`./?view=shop${q?`&q=${encodeURIComponent(q)}`:''}`;});
  if(params.get('q')) document.getElementById('global-search-input').value=params.get('q');
  updateCartCount();
})();
