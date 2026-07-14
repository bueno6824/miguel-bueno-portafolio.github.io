let sweetAlertPromise = null;

function loadStylesheet(
  href,
  id
) {
  const existingStylesheet =
    document.getElementById(id);

  if (existingStylesheet) {
    return Promise.resolve(
      existingStylesheet
    );
  }

  return new Promise(
    (resolve, reject) => {
      const link =
        document.createElement("link");

      link.id = id;
      link.rel = "stylesheet";
      link.href = href;

      link.addEventListener(
        "load",
        () => resolve(link),
        {
          once: true
        }
      );

      link.addEventListener(
        "error",
        () => {
          link.remove();

          reject(
            new Error(
              `No se pudo cargar ${href}`
            )
          );
        },
        {
          once: true
        }
      );

      document.head.appendChild(link);
    }
  );
}

function loadScript(
  src,
  id
) {
  const existingScript =
    document.getElementById(id);

  if (
    existingScript &&
    window.Swal
  ) {
    return Promise.resolve(
      window.Swal
    );
  }

  return new Promise(
    (resolve, reject) => {
      const script =
        existingScript ||
        document.createElement(
          "script"
        );

      script.id = id;
      script.src = src;
      script.async = true;

      script.addEventListener(
        "load",
        () => resolve(
          window.Swal
        ),
        {
          once: true
        }
      );

      script.addEventListener(
        "error",
        () => {
          script.remove();

          reject(
            new Error(
              `No se pudo cargar ${src}`
            )
          );
        },
        {
          once: true
        }
      );

      if (!existingScript) {
        document.body.appendChild(
          script
        );
      }
    }
  );
}

export function loadSweetAlert() {
  if (window.Swal) {
    return Promise.resolve(
      window.Swal
    );
  }

  if (sweetAlertPromise) {
    return sweetAlertPromise;
  }

  sweetAlertPromise =
    Promise.all([
      loadStylesheet(
        "styles/sweetalert2.min.css",
        "sweetAlertStyles"
      ),

      loadScript(
        "js/sweetalert2.all.min.js",
        "sweetAlertScript"
      )
    ])
      .then(([, Swal]) => Swal)
      .catch(error => {
        sweetAlertPromise = null;
        throw error;
      });

  return sweetAlertPromise;
}