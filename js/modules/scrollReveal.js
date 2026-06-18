export function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealElements.forEach(element => {
    observer.observe(element);
  });
}