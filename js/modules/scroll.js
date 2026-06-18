export function initScrollFeatures() {

  const progressBar =
    document.getElementById(
      "scroll-progress"
    );

  const scrollButton =
    document.getElementById(
      "btn-ir-arriba"
    );

  function updateScroll() {

    const scrollTop =
      document.documentElement.scrollTop;

    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width =
        `${progress}%`;
    }

    if (scrollButton) {

      if (scrollTop > 400) {

        scrollButton.classList.add(
          "show"
        );

      } else {

        scrollButton.classList.remove(
          "show"
        );

      }

    }

  }

  window.addEventListener(
    "scroll",
    updateScroll
  );

  updateScroll();

  if (scrollButton) {

    scrollButton.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }

}