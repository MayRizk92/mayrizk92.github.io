const button = document.getElementById("menuButton");
const menu = document.getElementById("menu");

button?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => menu.classList.remove("open"));
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

let serviceScrollPosition = 0;
let activeServiceButton = null;

function restoreServicePosition() {
  const savedPosition = serviceScrollPosition;
  const trigger = activeServiceButton;

  // Safari can adjust the page position after a native dialog closes.
  // Restore it over the next frames so the visitor stays in Services.
  requestAnimationFrame(() => {
    window.scrollTo(0, savedPosition);

    requestAnimationFrame(() => {
      window.scrollTo(0, savedPosition);

      if (trigger) {
        try {
          trigger.focus({ preventScroll: true });
        } catch {
          trigger.focus();
          window.scrollTo(0, savedPosition);
        }
      }
    });
  });

  setTimeout(() => window.scrollTo(0, savedPosition), 80);
}

document.querySelectorAll("[data-dialog]").forEach((serviceButton) => {
  serviceButton.addEventListener("click", () => {
    const dialog = document.getElementById(serviceButton.dataset.dialog);
    if (!dialog) return;

    serviceScrollPosition = window.scrollY;
    activeServiceButton = serviceButton;
    dialog.showModal();
  });
});

document.querySelectorAll(".service-dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close")?.addEventListener("click", (event) => {
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;

    if (clickedOutside) dialog.close();
  });

  // Covers the close button, clicking outside, and pressing Escape.
  dialog.addEventListener("close", restoreServicePosition);
});
