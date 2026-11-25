const page = document.body.dataset.page;
const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".nav-toggle");

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function clampInteger(raw, min, max) {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

window.SearchLab = { clampInteger };
