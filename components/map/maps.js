// Inicializa y configura el mapa de Google Maps de la sección de ubicación
export function initMap() {

    // Coordenadas de la ubicación que se mostrará en el mapa
    const ubicacion = {
        lat: 21.132532,
        lng: -101.673573
    };

    // Crea la instancia principal del mapa
    const map = new google.maps.Map(document.getElementById("map"), {

        // Nivel de acercamiento inicial del mapa
        zoom: 15,

        // Centra el mapa en la ubicación definida
        center: ubicacion,

        // Identificador del estilo personalizado del mapa
        mapId: "da2aa2c952e6b7c215f7ac34",

        // Personalización visual de los elementos del mapa
        styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0ea5e9" }] }
        ],

        // Oculta los controles predeterminados de Google Maps
        disableDefaultUI: true
    });

    // Crea un elemento HTML que será utilizado como marcador personalizado
    const markerDiv = document.createElement("div");

    // Asigna la clase CSS encargada del diseño y animación del marcador
    markerDiv.className = "radar-marker";

    // Crea el marcador avanzado utilizando el elemento HTML personalizado
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: ubicacion,
        content: markerDiv,
        title: "Miguel - Desarrollador"
    });

    // Crea la ventana de información que aparecerá al seleccionar el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="
                background:#0f172a;
                color:white;
                padding:10px;
                border-radius:10px;
                font-family:sans-serif;">
                <strong>Miguel</strong><br>
                Desarrollador Web & IoT<br>
                León, Guanajuato
            </div>
        `
    });

    // Escucha el evento de clic sobre el marcador
    marker.addListener("click", () => {

        // Abre la ventana de información asociada al marcador
        infoWindow.open({
            anchor: marker,
            map,
        });
    });
}