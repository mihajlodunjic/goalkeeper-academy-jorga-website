const root = document.documentElement;
const reveals = [...document.querySelectorAll<HTMLElement>(".reveal")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const showAll = () => {
  root.classList.remove("reveal-ready");
  reveals.forEach((element) => element.classList.add("is-visible"));
};

if (!reveals.length) {
  root.classList.remove("reveal-ready");
} else if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  showAll();
} else {
  try {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    reveals.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInitiallyVisible = rect.top < viewportHeight * 0.92 && rect.bottom > 0;

      if (isInitiallyVisible) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    });

    root.classList.add("reveal-ready");
  } catch {
    showAll();
  }
}
