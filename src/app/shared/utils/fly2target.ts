const MAPBOX_POS = {

};

export function fly2target(map, center?, zoom?, pitch?, bearing?) {
    map.flyTo({
        center: center ? center : [120.33246, 36.276589],
        zoom: zoom ? zoom : 9.688,
        bearing: bearing ? bearing : 0,
        pitch: pitch ? pitch : 55.5,
        speed: 0.8
    });
}