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
  const productTitle = productFeature.querySelector("[data-product-title]");
  const productNote = productFeature.querySelector("[data-product-note]");

  const showProduct = (option) => {
    productFeature.dataset.category = option.dataset.category;
    productFeature.setAttribute("aria-label", `${option.dataset.title} product category`);
    productTitle.textContent = option.dataset.title;
    productNote.textContent = option.dataset.note;
    productOptions.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === option));
    });
  };

  productOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => showProduct(option));
    option.addEventListener("focus", () => showProduct(option));
    option.addEventListener("click", () => showProduct(option));
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
