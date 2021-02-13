const MAPBOX_POS = {

};

export function fly2target(map: mapboxgl.Map, center?, zoom?, pitch?, bearing?) {
    map.flyTo({
        center: center ? center : [119.981, 35.869],
        zoom: zoom ? zoom : 9.688,
        bearing: bearing ? bearing : 0,
        pitch: pitch ? pitch : 55.5,
        speed: 0.8
    });
}