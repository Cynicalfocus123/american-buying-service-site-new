const video = document.querySelector("#hero-video");
const menuButton = document.querySelector(".nav-trigger");
const mobileNav = document.querySelector(".mobile-nav");
const desktopDropdowns = document.querySelectorAll(".desktop-nav .nav-dropdown");
const desktopMenuQuery = window.matchMedia("(min-width: 1101px)");
const dropdownCloseTimers = new WeakMap();

video?.play().catch(() => {
  // Browsers may defer autoplay until the page is visible.
});

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
  let activeProductIndex = 0;
  let controlScrollInProgress = false;
  let controlScrollTimer;
  const stepQueue = [];

  const syncProductTrackSpace = () => {
    if (!productTrack) return;
    productTrack.style.setProperty("--product-track-end-space", `${productTrack.clientWidth}px`);
  };

  const showProduct = (option, scrollIntoView = false) => {
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
    if (scrollIntoView && productTrack) scrollToProduct(option);
  };

  const updateProductControls = () => {
    if (previousProduct) previousProduct.disabled = activeProductIndex === 0;
    if (nextProduct) nextProduct.disabled = activeProductIndex === productOptions.length - 1;
  };

  const scrollToProduct = (option, instant = false) => {
    const showFollowingCard = window.matchMedia("(min-width: 761px)").matches;
    const followingIndex = (activeProductIndex + 1) % productOptions.length;
    const targetOption = showFollowingCard ? productOptions[followingIndex] : option;
    const target = Math.max(0, Math.min(
      targetOption.offsetLeft,
      productTrack.scrollWidth - productTrack.clientWidth
    ));
    productTrack.scrollTo({ left: target, behavior: instant || reduceMotion.matches ? "auto" : "smooth" });
  };

  const finishControlStep = () => {
    window.clearTimeout(controlScrollTimer);
    controlScrollInProgress = false;
    updateProductControls();
    const direction = stepQueue.shift();
    if (direction !== undefined) requestRelativeProduct(direction);
  };

  const requestRelativeProduct = (direction) => {
    if (controlScrollInProgress) {
      stepQueue.push(direction);
      return;
    }
    const nextIndex = Math.max(0, Math.min(productOptions.length - 1, activeProductIndex + direction));
    if (nextIndex === activeProductIndex) {
      updateProductControls();
      return;
    }
    controlScrollInProgress = true;
    showProduct(productOptions[nextIndex], true);
    if (reduceMotion.matches) {
      finishControlStep();
      return;
    }
    controlScrollTimer = window.setTimeout(finishControlStep, 420);
  };

  productOptions.forEach((option) => {
    option.addEventListener("focus", () => showProduct(option));
    option.addEventListener("click", () => {
      showProduct(option, true);
      window.location.href = productPages[option.dataset.category];
    });
  });

  previousProduct?.addEventListener("click", () => requestRelativeProduct(-1));
  nextProduct?.addEventListener("click", () => requestRelativeProduct(1));

  let scrollFrame;
  productTrack?.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const trackCenter = productTrack.getBoundingClientRect().left + productTrack.clientWidth / 2;
      let nearestOption = productOptions[0];
      let nearestDistance = Number.POSITIVE_INFINITY;
      productOptions.forEach((option) => {
        const optionBounds = option.getBoundingClientRect();
        const distance = Math.abs(optionBounds.left + optionBounds.width / 2 - trackCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestOption = option;
        }
      });
      if (!controlScrollInProgress) {
        showProduct(nearestOption);
        updateProductControls();
      }
    });
  }, { passive: true });

  showProduct(productOptions[0]);
  updateProductControls();
  syncProductTrackSpace();
  scrollToProduct(productOptions[0], true);
  window.addEventListener("resize", () => {
    syncProductTrackSpace();
    scrollToProduct(productOptions[activeProductIndex], true);
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();
