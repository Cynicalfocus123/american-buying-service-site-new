const video = document.querySelector("#hero-video");
const menuButton = document.querySelector(".nav-trigger");
const mobileNav = document.querySelector(".mobile-nav");
const desktopDropdowns = document.querySelectorAll(".desktop-nav .nav-dropdown");
const desktopMenuQuery = window.matchMedia("(min-width: 1101px)");
const dropdownCloseTimers = new WeakMap();

video?.play().catch(() => {
  // Browsers may defer autoplay until the page is visible.
});

const countryStat = document.querySelector(".about-page .about-stat-grid .about-stat:last-child");
if (countryStat) {
  const value = countryStat.querySelector("strong");
  const label = countryStat.querySelector("p");
  if (value && label) {
    value.removeAttribute("data-count");
    const counter = document.createElement("span");
    counter.dataset.count = "75";
    counter.textContent = "0";
    value.replaceChildren(counter, document.createTextNode("+"));
    label.textContent = "countries served";
  }
}

const statSection = document.querySelector("[data-stat-section]");
if (statSection) {
  const counters = statSection.querySelectorAll("[data-count]");
  const renderCount = (counter, value) => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1400;
    const start = performance.now();
    const update = (now) => {
      const progress = duration ? Math.min((now - start) / duration, 1) : 1;
      counter.textContent = Math.round(value * (1 - Math.pow(1 - progress, 3))).toLocaleString("en-US");
      if (progress < 1) window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    counters.forEach((counter) => renderCount(counter, Number(counter.dataset.count)));
    observer.disconnect();
  }, { threshold: .25 });
  observer.observe(statSection);
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileNav.classList.toggle("is-open", !open);
  if (open) {
    mobileNav.querySelectorAll("details").forEach((dropdown) => {
      dropdown.open = false;
    });
  }
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    mobileNav.querySelectorAll("details").forEach((dropdown) => {
      dropdown.open = false;
    });
  });
});

desktopDropdowns.forEach((dropdown) => {
  const summary = dropdown.querySelector("summary");

  dropdown.addEventListener("pointerenter", () => {
    if (!desktopMenuQuery.matches) return;
    window.clearTimeout(dropdownCloseTimers.get(dropdown));
    desktopDropdowns.forEach((other) => {
      if (other !== dropdown) other.open = false;
    });
    dropdown.open = true;
  });

  dropdown.addEventListener("pointerleave", () => {
    if (!desktopMenuQuery.matches) return;
    const timer = window.setTimeout(() => {
      dropdown.open = false;
    }, 180);
    dropdownCloseTimers.set(dropdown, timer);
  });

  summary.addEventListener("click", (event) => {
    if (!desktopMenuQuery.matches || event.detail === 0) return;
    event.preventDefault();
    dropdown.open = true;
  });

  dropdown.addEventListener("toggle", () => {
    if (!dropdown.open) return;
    desktopDropdowns.forEach((other) => {
      if (other !== dropdown) other.open = false;
    });
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".desktop-nav")) return;
  desktopDropdowns.forEach((dropdown) => {
    dropdown.open = false;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.querySelector(".site-search-dialog[open]")) return;
  desktopDropdowns.forEach((dropdown) => {
    dropdown.open = false;
  });
  mobileNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.focus();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    mobileNav.querySelectorAll("details").forEach((dropdown) => {
      dropdown.open = false;
    });
  } else {
    desktopDropdowns.forEach((dropdown) => {
      window.clearTimeout(dropdownCloseTimers.get(dropdown));
      dropdown.open = false;
    });
  }
});

const productFeature = document.querySelector(".product-feature");
const productOptions = document.querySelectorAll(".product-option");

if (productFeature && productOptions.length) {
  const productPages = {
    otop: "otop-global.html",
    electronics: "consumer-electronics.html",
    food: "food-and-beverage.html",
    sport: "sport-fitness.html",
    home: "home-decor-furniture.html",
    garment: "garment-accessories.html"
  };
  const productCarousel = document.querySelector("[data-product-carousel]");
  const productTrack = productCarousel?.querySelector(".product-options");
  const productTitle = productFeature.querySelector("[data-product-title]");
  const productNote = productFeature.querySelector("[data-product-note]");
  const productFeatureLink = productFeature.querySelector(".product-feature-link");
  const productCurrent = productCarousel?.querySelector("[data-product-current]");
  const productProgress = productCarousel?.querySelector(".product-progress");
  const previousProduct = productCarousel?.querySelector("[data-product-previous]");
  const nextProduct = productCarousel?.querySelector("[data-product-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopProductTrack = window.matchMedia("(min-width: 761px)");
  let activeProductIndex = 0;

  const showProduct = (option) => {
    productFeature.dataset.category = option.dataset.category;
    productFeature.setAttribute("aria-label", `${option.dataset.title} product category`);
    productTitle.textContent = option.dataset.title;
    productNote.textContent = option.dataset.note;
    if (productFeatureLink) productFeatureLink.href = productPages[option.dataset.category];
    const productIndex = Array.from(productOptions).indexOf(option);
    activeProductIndex = productIndex;
    if (productCurrent) productCurrent.textContent = String(productIndex + 1).padStart(2, "0");
    if (productProgress) productProgress.style.setProperty("--product-progress", String(productIndex));
    productOptions.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === option));
    });
  };

  const updateProductControls = () => {
    if (previousProduct) previousProduct.disabled = activeProductIndex === 0;
    if (nextProduct) nextProduct.disabled = activeProductIndex === productOptions.length - 1;
  };

  const arrangeProductOptions = () => {
    productOptions.forEach((option, index) => {
      if (!desktopProductTrack.matches) {
        option.style.order = "";
        return;
      }
      const relativeIndex = (index - activeProductIndex + productOptions.length) % productOptions.length;
      option.style.order = String(relativeIndex || productOptions.length);
    });
  };

  const scrollToProduct = (productIndex, instant = false) => {
    if (!productTrack) return;
    const target = desktopProductTrack.matches
      ? 0
      : Math.max(0, Math.min(
        productOptions[productIndex].offsetLeft,
        productTrack.scrollWidth - productTrack.clientWidth
      ));
    productTrack.scrollTo({ left: target, behavior: instant || reduceMotion.matches ? "auto" : "smooth" });
  };

  const selectProduct = (productIndex, scrollIntoView = false, instant = false) => {
    showProduct(productOptions[productIndex]);
    arrangeProductOptions();
    if (scrollIntoView) scrollToProduct(productIndex, instant);
    updateProductControls();
  };

  const requestRelativeProduct = (direction) => {
    const nextIndex = Math.max(0, Math.min(productOptions.length - 1, activeProductIndex + direction));
    if (nextIndex !== activeProductIndex) selectProduct(nextIndex, true);
  };

  productOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectProduct(Array.from(productOptions).indexOf(option), true);
      window.location.href = productPages[option.dataset.category];
    });
  });

  previousProduct?.addEventListener("click", () => requestRelativeProduct(-1));
  nextProduct?.addEventListener("click", () => requestRelativeProduct(1));

  selectProduct(0, true, true);
  window.addEventListener("resize", () => {
    arrangeProductOptions();
    scrollToProduct(activeProductIndex, true);
  }, { passive: true });
}

const arrangeFooterContactLinks = () => {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    const footerContact = footer.querySelector(".footer-contact");
    const footerLinks = footer.querySelector(".footer-link-list");
    if (!footerContact || !footerLinks) return;

    const footerHeading = footerContact.querySelector("h2");
    if (footerHeading) footerHeading.textContent = "Contact Information";
    footerContact.querySelector("address")?.remove();

    footerLinks.querySelectorAll("a").forEach((link) => {
      if (["Affiliate Office", "Complaint", "Our Mission"].includes(link.textContent.trim())) link.remove();
    });

    const contactLink = Array.from(footerLinks.querySelectorAll('a[href="contact.html"]'))[0];
    if (contactLink) {
      contactLink.classList.add("footer-contact-link");
      footerHeading?.insertAdjacentElement("afterend", contactLink);
    }
  });
};

arrangeFooterContactLinks();

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const fields = [
      ["First name", formData.get("first-name")],
      ["Last name", formData.get("last-name")],
      ["Email address", formData.get("email")],
      ["Phone number", formData.get("phone")],
      ["Message", formData.get("message")]
    ];
    const body = fields
      .filter(([, value]) => String(value ?? "").trim())
      .map(([label, value]) => `${label}: ${String(value).trim()}`)
      .join("\n\n");
    const mailto = new URL("mailto:info@americanbuyingservice.com");
    mailto.searchParams.set("subject", "Contact request from American Buying Service website");
    mailto.searchParams.set("body", body);
    window.location.assign(mailto.href);
  });
}

const SITE_SEARCH_PAGES = Object.freeze([
  { href: "index.html", title: "Home" },
  { href: "about.html", title: "About Us" },
  { href: "contact.html", title: "Contact Us" },
  { href: "brand-building-service.html", title: "Brand Building Service" },
  { href: "warehousing-fulfillment-service.html", title: "Warehousing and Fulfillment" },
  { href: "drop-ship-service.html", title: "Drop Ship Service" },
  { href: "sourcing-procurement-service.html", title: "Sourcing and Procurement" },
  { href: "marketplace-ecommerce-sales.html", title: "Marketplace and Ecommerce Sales" },
  { href: "virtual-office-support.html", title: "Virtual Office Support" },
  { href: "sales-marketing-service.html", title: "Sales and Marketing" },
  { href: "trade-show-representation.html", title: "Trade Show Representation" },
  { href: "formulation-development-service.html", title: "Formulation and Development Service" },
  { href: "packaging-design.html", title: "Packaging and Design" },
  { href: "consumer-electronics.html", title: "Consumer Electronics" },
  { href: "food-and-beverage.html", title: "Food and Beverage" },
  { href: "garment-accessories.html", title: "Garment and Accessories" },
  { href: "home-decor-furniture.html", title: "Home Decor and Furniture" },
  { href: "otop-global.html", title: "OTOP Global" },
  { href: "sport-fitness.html", title: "Sport and Fitness" },
  { href: "privacy-policy.html", title: "Privacy Policy" },
  { href: "terms-and-conditions.html", title: "Terms and Conditions" }
]);

const normalizeSearchQuery = (value) => String(value ?? "")
  .normalize("NFKC")
  .replace(/[\u0000-\u001F\u007F]/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 120);

const searchTextCache = new Map();

const readSearchPage = async (page) => {
  if (searchTextCache.has(page.href)) return searchTextCache.get(page.href);

  const pageUrl = new URL(page.href, window.location.href);
  if (pageUrl.origin !== window.location.origin) return "";

  const response = await fetch(pageUrl.href, {
    cache: "force-cache",
    credentials: "same-origin",
    redirect: "error"
  });
  if (!response.ok) return "";

  const source = new DOMParser().parseFromString(await response.text(), "text/html");
  source.querySelectorAll("script, style, noscript, template").forEach((element) => element.remove());
  const pageContent = source.querySelector("main")?.textContent ?? source.body?.textContent ?? "";
  const text = `${page.title} ${pageContent}`.replace(/\s+/g, " ").trim().toLocaleLowerCase("en-US");
  searchTextCache.set(page.href, text);
  return text;
};

const createSiteSearch = () => {
  const headerSearchTriggers = Array.from(document.querySelectorAll('.header-tools button[aria-label="Search"]'));
  if (!headerSearchTriggers.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "site-search-dialog";
  dialog.setAttribute("aria-labelledby", "site-search-title");

  const panel = document.createElement("div");
  panel.className = "site-search-panel";
  const dialogHeader = document.createElement("div");
  dialogHeader.className = "site-search-header";
  const title = document.createElement("h2");
  title.id = "site-search-title";
  title.textContent = "Search the site";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "site-search-close";
  close.setAttribute("aria-label", "Close search");
  close.textContent = "×";
  dialogHeader.append(title, close);

  const form = document.createElement("form");
  form.className = "site-search-form";
  form.noValidate = true;
  const label = document.createElement("label");
  label.htmlFor = "site-search-input";
  label.textContent = "Search all pages";
  const formRow = document.createElement("div");
  formRow.className = "site-search-form-row";
  const input = document.createElement("input");
  input.id = "site-search-input";
  input.name = "q";
  input.type = "search";
  input.autocomplete = "off";
  input.maxLength = 120;
  input.placeholder = "Search services, products, locations, and more";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "button button-primary";
  submit.textContent = "Search";
  formRow.append(input, submit);
  form.append(label, formRow);

  const status = document.createElement("p");
  status.className = "site-search-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const results = document.createElement("ul");
  results.className = "site-search-results";
  panel.append(dialogHeader, form, status, results);
  dialog.append(panel);
  document.body.append(dialog);

  let lastSearchTrigger = null;
  const searchTriggers = [...headerSearchTriggers];
  const mobileSearchTrigger = document.createElement("button");
  mobileSearchTrigger.type = "button";
  mobileSearchTrigger.className = "mobile-search-trigger";
  mobileSearchTrigger.textContent = "Search";
  mobileSearchTrigger.setAttribute("aria-label", "Search the site");
  if (mobileNav) {
    mobileNav.prepend(mobileSearchTrigger);
    searchTriggers.push(mobileSearchTrigger);
  }

  const clearSearchResults = () => {
    status.textContent = "";
    results.replaceChildren();
  };

  const openSearch = (trigger) => {
    lastSearchTrigger = trigger;
    clearSearchResults();
    input.value = "";
    searchTriggers.forEach((button) => button.setAttribute("aria-expanded", "true"));
    dialog.showModal();
    window.requestAnimationFrame(() => input.focus());
  };

  const renderSearchResults = (matches) => {
    results.replaceChildren();
    matches.forEach((page) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = page.href;
      const resultTitle = document.createElement("strong");
      resultTitle.textContent = page.title;
      const resultPath = document.createElement("span");
      resultPath.textContent = page.href.replace(".html", "").replaceAll("-", " ");
      link.append(resultTitle, resultPath);
      item.append(link);
      results.append(item);
    });
  };

  searchTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => openSearch(trigger));
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    searchTriggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    lastSearchTrigger?.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = normalizeSearchQuery(input.value);
    input.value = query;
    clearSearchResults();
    if (!query) {
      status.textContent = "Enter a search term.";
      input.focus();
      return;
    }

    submit.disabled = true;
    status.textContent = "Searching the site…";
    const terms = query.toLocaleLowerCase("en-US").split(" ").filter(Boolean);
    try {
      const indexedPages = await Promise.all(SITE_SEARCH_PAGES.map(async (page) => ({
        page,
        text: await readSearchPage(page)
      })));
      const matches = indexedPages
        .filter(({ text }) => terms.every((term) => text.includes(term)))
        .sort((first, second) => {
          const firstTitle = first.page.title.toLocaleLowerCase("en-US");
          const secondTitle = second.page.title.toLocaleLowerCase("en-US");
          return Number(terms.every((term) => secondTitle.includes(term))) - Number(terms.every((term) => firstTitle.includes(term)));
        })
        .map(({ page }) => page);
      status.textContent = matches.length
        ? `${matches.length} result${matches.length === 1 ? "" : "s"} found for “${query}”.`
        : `No results found for “${query}”.`;
      renderSearchResults(matches);
    } catch {
      status.textContent = "Search is temporarily unavailable. Please try again.";
    } finally {
      submit.disabled = false;
    }
  });
};

createSiteSearch();

document.querySelector("#year").textContent = new Date().getFullYear();
