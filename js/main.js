// Importa todos los módulos
import './navbar.js';
import './scroll.js';
import './darkmode.js';

import './email.js';
import './datetime.js';
import './filters.js';
import './search.js';
import './herramientas.js';
import './proyectos.js';
import './modals.js';
import './chatbot.js';


// 👇 Lazy load del mapa
const mapContainer = document.querySelector('#map');

if (mapContainer) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadGoogleMaps();
            observer.disconnect();
        }
    }, {
        rootMargin: '200px'
    });

    observer.observe(mapContainer);
}

function loadGoogleMaps() {

    if (typeof window.google !== "undefined" && window.google.maps) {
        return;
    }

    const script = document.createElement('script');

    script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2o8i6W4beLVbijCl3qdayBsICwblrcGA&v=weekly&libraries=marker';

    script.async = true;

    script.onload = async () => {
        const { initMap } = await import('./maps.js');
        initMap();
    };

    document.head.appendChild(script);
}
// Aquí podrías agregar código general si lo necesitas
console.log("Todos los módulos cargados correctamente");
