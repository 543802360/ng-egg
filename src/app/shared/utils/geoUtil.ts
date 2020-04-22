import * as wkt from "wicket";

const WKT = new wkt.Wkt();

function wkt2geojson(wkt) {

}

function geojson2wkt(geojson) {
  WKT.read(geojson);
  return WKT.write();
}

export { wkt2geojson, geojson2wkt }
