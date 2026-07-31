const video = document.querySelector("#hero-video");
const menuButton = document.querySelector(".nav-trigger");
const mobileNav = document.querySelector(".mobile-nav");
const desktopDropdowns = document.querySelectorAll(".desktop-nav .nav-dropdown");
const desktopMenuQuery = window.matchMedia("(min-width: 1101px)");
const dropdownCloseTimers = new WeakMap();

video.play().catch(() => {
  // Browsers may defer autoplay until the page is visible.
});

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
  const productCarousel = document.querySelector("[data-product-carousel]");
  const productTrack = productCarousel?.querySelector(".product-options");
  const productTitle = productFeature.querySelector("[data-product-title]");
  const productNote = productFeature.querySelector("[data-product-note]");
  const productCurrent = productCarousel?.querySelector("[data-product-current]");
  const previousProduct = productCarousel?.querySelector("[data-product-previous]");
  const nextProduct = productCarousel?.querySelector("[data-product-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const showProduct = (option, scrollIntoView = false) => {
    productFeature.dataset.category = option.dataset.category;
    productFeature.setAttribute("aria-label", `${option.dataset.title} product category`);
    productTitle.textContent = option.dataset.title;
    productNote.textContent = option.dataset.note;
    const productIndex = Array.from(productOptions).indexOf(option);
    if (productCurrent) productCurrent.textContent = String(productIndex + 1).padStart(2, "0");
    productOptions.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === option));
    });
    if (scrollIntoView) {
      option.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  };

  productOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) showProduct(option);
    });
    option.addEventListener("focus", () => showProduct(option));
    option.addEventListener("click", () => showProduct(option, true));
  });

  const showRelativeProduct = (direction) => {
    const activeIndex = Array.from(productOptions).findIndex((item) => item.getAttribute("aria-pressed") === "true");
    const nextIndex = (activeIndex + direction + productOptions.length) % productOptions.length;
    showProduct(productOptions[nextIndex], true);
  };

  previousProduct?.addEventListener("click", () => showRelativeProduct(-1));
  nextProduct?.addEventListener("click", () => showRelativeProduct(1));

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
      showProduct(nearestOption);
    });
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();
