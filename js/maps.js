export function initMap() {

    const ubicacion = {
        lat: 21.132532,
        lng: -101.673573
    };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: ubicacion,
        mapId: "da2aa2c952e6b7c215f7ac34",
        styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0ea5e9" }] }
        ],
        disableDefaultUI: true
    });

    const markerDiv = document.createElement("div");
    markerDiv.className = "radar-marker";

    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: ubicacion,
        content: markerDiv,
        title: "Miguel - Desarrollador"
    });

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

    marker.addListener("click", () => {
        infoWindow.open({
            anchor: marker,
            map,
        });
    });
}