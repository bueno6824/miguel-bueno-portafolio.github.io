// Guarda la promesa de carga de SweetAlert para evitar cargar los recursos múltiples veces.
let sweetAlertPromise = null;


// Carga dinámicamente una hoja de estilos y devuelve una promesa con el elemento cargado.
function loadStylesheet(

  href,

  id

) {

  // Comprueba si la hoja de estilos ya fue agregada al documento.
  const existingStylesheet =

    document.getElementById(id);

  // Si ya existe, devuelve inmediatamente el elemento mediante una promesa resuelta.
  if (existingStylesheet) {

    return Promise.resolve(

      existingStylesheet

    );

  }

  // Crea una promesa que controla la carga del archivo CSS.
  return new Promise(

    (resolve, reject) => {

      // Crea dinámicamente el elemento link para la hoja de estilos.
      const link =

        document.createElement("link");

      // Asigna el identificador único del recurso.
      link.id = id;

      // Define el elemento como una hoja de estilos.
      link.rel = "stylesheet";

      // Establece la ubicación del archivo CSS.
      link.href = href;

      // Resuelve la promesa cuando la hoja de estilos termina de cargar.
      link.addEventListener(

        "load",

        () => resolve(link),

        {

          once: true

        }

      );

      // Maneja los errores ocurridos durante la carga de la hoja de estilos.
      link.addEventListener(

        "error",

        () => {

          // Elimina el elemento que no pudo cargarse correctamente.
          link.remove();

          // Rechaza la promesa indicando el recurso que produjo el error.
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

      // Agrega la hoja de estilos al encabezado del documento.
      document.head.appendChild(link);

    }

  );

}


// Carga dinámicamente el archivo JavaScript de SweetAlert y devuelve su instancia.
function loadScript(

  src,

  id

) {

  // Comprueba si el script ya existe en el documento.
  const existingScript =

    document.getElementById(id);

  // Si el script ya existe y SweetAlert está disponible, reutiliza la instancia existente.
  if (

    existingScript &&

    window.Swal

  ) {

    return Promise.resolve(

      window.Swal

    );

  }

  // Crea una promesa que controla la carga del script.
  return new Promise(

    (resolve, reject) => {

      // Reutiliza el script existente o crea uno nuevo cuando todavía no existe.
      const script =

        existingScript ||

        document.createElement(

          "script"

        );

      // Asigna el identificador único del script.
      script.id = id;

      // Define la ubicación del archivo JavaScript.
      script.src = src;

      // Permite que el navegador cargue el script de forma asíncrona.
      script.async = true;

      // Resuelve la promesa cuando el script termina de cargarse.
      script.addEventListener(

        "load",

        () => resolve(

          window.Swal

        ),

        {

          once: true

        }

      );

      // Maneja los errores ocurridos durante la carga del script.
      script.addEventListener(

        "error",

        () => {

          // Elimina el script que no pudo cargarse correctamente.
          script.remove();

          // Rechaza la promesa indicando el recurso que produjo el error.
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

      // Agrega el script al documento únicamente cuando todavía no existe.
      if (!existingScript) {

        document.body.appendChild(

          script

        );

      }

    }

  );

}


// Carga los recursos necesarios para utilizar SweetAlert2.
export function loadSweetAlert() {

  // Reutiliza directamente SweetAlert si ya está disponible en la ventana.
  if (window.Swal) {

    return Promise.resolve(

      window.Swal

    );

  }

  // Reutiliza una carga que ya se encuentre en proceso.
  if (sweetAlertPromise) {

    return sweetAlertPromise;

  }

  // Carga simultáneamente los estilos y el script necesarios para SweetAlert2.
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

      // Obtiene la instancia de SweetAlert una vez cargados ambos recursos.
      .then(([, Swal]) => Swal)

      // Restablece la promesa si ocurre un error para permitir un nuevo intento de carga.
      .catch(error => {

        sweetAlertPromise = null;

        throw error;

      });

  // Devuelve la promesa correspondiente a la carga de SweetAlert2.
  return sweetAlertPromise;

}