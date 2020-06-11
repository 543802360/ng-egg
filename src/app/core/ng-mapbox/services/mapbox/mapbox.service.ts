import { Injectable } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import ZoomControl from "mapbox-gl-controls/lib/zoom";
import CompassControl from "mapbox-gl-controls/lib/compass";
import RulerControl from "mapbox-gl-controls/lib/ruler";
import { dark } from '@core/ng-mapbox/styles/dark';
import { decimal } from '@core/ng-mapbox/styles/decimal';

@Injectable({
  providedIn: "root"
})
export class MapboxService {
  private map: mapboxgl.Map;
  private defaultOptions = {
    style: dark,
    zoom: 8,
    minZoom: 2,
    maxZoom: 19,
    center: [120.35831, 36.40399]
  }
  constructor(private http: HttpClient) {

    (mapboxgl as any).workerCount = 3;
    (mapboxgl as any).maxParallelImageRequests = 200;

  }

  public get Map() {
    return this.map;
  }

  init(options: any) {

    const option = options ? { ...this.defaultOptions, ...options } : this.defaultOptions;
    console.log(option);
    this.map = new mapboxgl.Map(option);
    this.initControl();
    this.registerEvent();
  }

  initControl() {
    this.map.addControl(new ZoomControl(), "top-right");
    this.map.addControl(new CompassControl(), "top-right");

    const styles = [
      {
        title: "dark",
        uri: JSON.stringify(dark)
      },
      {
        title: "decimal",
        uri: JSON.stringify(decimal)
      }
    ];
    const styleControl = new MapboxStyleSwitcherControl(styles);
    // this.map.addControl(styleControl);
  }
  getStyle(url: string) {
    return this.http.get;
  }

  registerEvent() {
    this.map.on("resize", e => {
      console.log("resized!");
    });
  }

  resize() {
    this.map.resize();
  }

  setStyle(style: any) {
    this.map.setStyle(style);
  }


  addStyleSwitchControl() {

  }
}
