const video = document.querySelector("#hero-video");
const menuButton = document.querySelector(".nav-trigger");
const mobileNav = document.querySelector(".mobile-nav");
const desktopDropdowns = document.querySelectorAll(".desktop-nav .nav-dropdown");

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
      dropdown.open = false;
    });
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
