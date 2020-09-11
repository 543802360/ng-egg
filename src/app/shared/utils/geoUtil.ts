
import * as turf from "@turf/turf";

function Point(lat, lng, properties) {
  return turf.point([lng, lat], properties);
}

function points() {

}

export { Point };