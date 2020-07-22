import { Injectable } from '@angular/core';
import { centroid, center, bboxPolygon } from "@turf/turf";
@Injectable({
  providedIn: 'root'
})
export class GeoUtilService {

  constructor() { }

  center(geojson) {
    return center(geojson);
  }

}
