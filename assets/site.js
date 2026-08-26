(function () {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "assets/favicon.svg";
  document.head.appendChild(favicon);
  const config = window.SOUL_COLOR_CONFIG;
  const page = document.body.dataset.page || "home";
  const navItems = [
    ["about", "人物調色盤", "about.html"],
    ["profile", "關於我", "profile.html"],
    ["services", "服務方案", "services.html"],
    ["faq", "FAQ", "faq.html"]
  ];

  function mockupMarkup(type, title) {
    const chips = '<i style="--c:#6C3D33"></i><i style="--c:#93584C"></i><i style="--c:#B97865"></i><i style="--c:#C89C82"></i><i style="--c:#E4CBB9"></i>';
    const paper = `<article class="mock-paper"><span>SOUL COLOR · PERSON PALETTE</span><h3>${title}</h3><div class="mock-rule"></div><p>用色彩記下這一次相遇裡<br>看見的不同角度</p><div class="mock-chips">${chips}</div></article>`;
    if (type === "a4") return `<div class="product-stage product-stage--a4"><img class="sample-work-image" src="assets/images/sample-color-memory-aiqi.png" alt="色彩留影 A4 色彩人物整理作品範例"></div>`;
    if (type === "single") return `<div class="product-stage product-stage--single" aria-label="單張 IG 貼文與 A4 整理範例版位"><article class="ig-sheet"><span>人物調色盤</span><strong>你會怎麼<br>介紹自己？</strong><div class="mock-chips">${chips}</div></article>${paper}</div>`;
    return `<div class="product-stage product-stage--carousel" aria-label="色彩人物誌輪播貼文範例版位"><div class="story-deck"><article><span>01</span><strong>人物<br>調色盤</strong></article><article><span>02</span><strong>從色彩<br>開始對談</strong><div class="mock-chips">${chips}</div></article><article><span>03—08</span><strong>展開一段<br>人物故事</strong></article></div></div>`;
  }

  function priceMarkup(service) {
    const price = service.prices;
    if (!price) return "";
    return `<div class="service-pricing" aria-label="${service.title}價格">
      <p class="price-featured"><span>體驗價</span><strong>NT$ ${price.trial}</strong><small>${price.trialNote}</small></p>
      <div class="price-notes"><p><span>原價</span><strong>NT$ ${price.original}</strong></p><p><span>早鳥價</span><strong>NT$ ${price.early}</strong><small>${price.earlyNote}</small></p></div>
    </div>`;
  }

  function overviewPriceMarkup(service) {
    const price = service.prices;
    if (!price) return "";
    return `<div class="overview-pricing" aria-label="${service.title}體驗價格"><p class="overview-price-main"><span>體驗價</span><strong>NT$ ${price.trial}</strong><small>${price.trialNote}</small></p></div>`;
  }

  function deliverablesMarkup(items) {
    return items.map(item => {
      const [title, note] = item.split("｜");
      return `<li>${note ? `<strong>${title}</strong><small>${note}</small>` : title}</li>`;
    }).join("");
  }

  function initShell() {
    const header = document.querySelector("[data-site-header]");
    if (header) {
      header.innerHTML = `<a class="brand" href="index.html" aria-label="Soul Color 首頁"><span>SOUL COLOR</span><small>PERSON PALETTE</small></a><nav class="desktop-nav" aria-label="主要導覽">${navItems.map(([key,label,href]) => `<a ${page === key ? 'aria-current="page"' : ""} href="${href}">${label}</a>`).join("")}</nav><a class="nav-order order-link" href="#">立即預約</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span><b class="sr-only">開啟選單</b></button><div class="mobile-menu" id="mobileMenu" hidden>${navItems.map(([key,label,href]) => `<a ${page === key ? 'aria-current="page"' : ""} href="${href}">${label}</a>`).join("")}<a class="button button--primary order-link" href="#">立即預約</a></div>`;
    }
    const footer = document.querySelector("[data-site-footer]");
    if (footer) footer.innerHTML = `<div class="footer-brand"><span>SOUL COLOR</span></div><nav aria-label="頁尾導覽"><a href="about.html">人物調色盤</a><a href="profile.html">關於我</a><a href="services.html">服務方案</a><a href="faq.html">FAQ</a></nav><small>© ${new Date().getFullYear()} Soul Color</small>`;
    document.querySelectorAll(".order-link").forEach(link => {
      link.href = config.orderURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
      document.body.classList.toggle("menu-open", !open);
      toggle.querySelector("b").textContent = open ? "開啟選單" : "關閉選單";
    });
  }

  function renderServicesOverview() {
    const root = document.querySelector("[data-services-overview]");
    if (!root) return;
    root.innerHTML = Object.entries(config.services).map(([slug, service], index) => `
      <article class="service-row service-row--${slug} ${index % 2 ? "service-row--reverse" : ""} reveal" id="service-${slug}">
        <div class="service-copy"><div class="service-heading"><span class="section-number">${service.number}</span></div><h2><a href="service-${slug}.html">${service.title}<span aria-hidden="true">↗</span></a></h2><p class="service-positioning">${service.positioning}</p>${overviewPriceMarkup(service)}<p class="service-duration">${service.duration}</p><details class="service-more"><summary>查看價格與方案內容</summary><div class="service-more-panel"><dl class="service-alt-prices"><div><dt>原價</dt><dd>NT$ ${service.prices.original}</dd></div><div><dt>早鳥價</dt><dd>NT$ ${service.prices.early}<small>${service.prices.earlyNote}</small></dd></div></dl><div class="service-includes"><h3>你會收到</h3><ul>${deliverablesMarkup(service.deliverables)}</ul></div></div></details></div>
        <a class="service-visual" href="service-${slug}.html" aria-label="查看${service.title}作品與方案詳情">${mockupMarkup(service.mockup, service.title)}</a>
      </article>`).join("");
  }

  function renderServiceDetail() {
    const root = document.querySelector("[data-service-detail]");
    if (!root) return;
    const slug = document.body.dataset.service;
    const service = config.services[slug];
    root.innerHTML = `
      <section class="detail-hero page-hero"><div class="page-light-field" aria-hidden="true"></div><div class="detail-hero-copy"><p class="eyebrow">SERVICE ${service.number}</p><h1>${service.title}</h1><p class="lead">${service.positioning}</p>${priceMarkup(service)}<p class="service-duration">${service.duration}</p><p class="service-logistics"><span>線上訪談</span><span>訪談後約 5 天內交付電子檔</span><span>成品最多可修改兩次哦</span></p><a class="button button--primary order-link" href="${config.orderURL}" target="_blank" rel="noopener noreferrer">預約${service.title}</a></div><div class="detail-hero-visual">${mockupMarkup(service.mockup, service.title)}</div></section>
      <section class="detail-fit section-pad reveal"><div><p class="eyebrow">FOR YOU</p><h2>這個方案<br>適合現在的你嗎？</h2></div><ul>${service.fit.map(item => `<li>${item}</li>`).join("")}</ul></section>
      <section class="detail-deliver section-pad reveal"><div class="deliver-copy"><p class="eyebrow">YOU WILL RECEIVE</p><h2>你會得到</h2><ul>${deliverablesMarkup(service.deliverables)}</ul><p class="note">色彩不是人格答案。成品記錄的是這一次相遇裡，我們一起看見的角度。</p><a class="text-link detail-faq-link" href="faq.html">有其他問題？前往 FAQ <span>↗</span></a></div><div>${mockupMarkup(service.mockup, service.title)}</div></section>
      <section class="closing-cta closing-cta--light reveal"><p><span>這個方案符合你想留下的方式嗎？</span><span>預約後，我們會一起確認訪談時間。</span></p><a class="button button--primary order-link" href="${config.orderURL}" target="_blank" rel="noopener noreferrer">預約${service.title}</a></section>`;
  }

  function renderWorkArtifacts() {
    document.querySelectorAll("[data-artifact]").forEach(root => {
      const title = root.dataset.artifact === "a4" ? "色彩留影" : root.dataset.artifact === "single" ? "色彩人物卡" : "色彩人物誌";
      const stage = document.createElement("div");
      stage.innerHTML = mockupMarkup(root.dataset.artifact, title);
      const rendered = stage.firstElementChild;
      if (!rendered) return;
      root.replaceWith(rendered);
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return items.forEach(el => el.classList.add("is-visible"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  }

  function initTitleReveal() {
    const titles = document.querySelectorAll("main h1, main h2");
    if (!titles.length) return;
    titles.forEach(title => title.classList.add("title-reveal"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return titles.forEach(title => title.classList.add("is-title-visible"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-title-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    requestAnimationFrame(() => requestAnimationFrame(() => titles.forEach(title => observer.observe(title))));
  }

  function initFaq() {
    document.querySelectorAll("details").forEach(detail => detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      detail.parentElement.querySelectorAll("details[open]").forEach(other => { if (other !== detail) other.open = false; });
    }));
  }

  initShell();
  initMenu();
  renderServicesOverview();
  renderServiceDetail();
  renderWorkArtifacts();
  initFaq();
  initTitleReveal();
  initReveal();
})();
