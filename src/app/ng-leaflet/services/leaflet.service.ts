import { LazyService } from '@delon/util';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as L from "leaflet";
import * as esri from "esri-leaflet";
import { environment } from "../../../environments/environment"
@Injectable({
  providedIn: "any"
})
export class LeafletService {
  private _layerControl: L.Control.Layers;
  private _map: L.Map;

  constructor(private http: HttpClient,
    private lazySrv: LazyService) {
    this.lazySrv.load("assets/lib/leaflet-proj4/proj4.js").then(
      () => {
        this.lazySrv.load("assets/lib/leaflet-proj4/proj4leaflet.js").then(

        )
      }
    )
  }

  /**
   * @prop {L.map} map 地图
   */
  get map() {
    return this._map;
  }

  public get layerControl() {
    return this._layerControl;
  }


  init(container: HTMLElement, options?: any) {


    const crs = new (L as any).Proj.CRS(
      "EPSG:4326",
      "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ",
      {
        origin: [-180.0, 90],
        resolutions: [
          0.002746582031854997,
          0.0013732910159274985,
          6.866454960783415e-4,
          3.4332275992457847e-4,
          1.7166136807926098e-4,
          8.583068403963049e-5,
          4.291534201862551e-5,
          2.1457682893530753e-5,
          1.0728841446765377e-5,
          5.364420724572418e-6,
          2.6822103610964784e-6,
          1.3411051805482392e-6
        ]
      }
    );
    const bottomleft = L.latLng(35.582647672000064, 119.51021662400001);
    const topright = L.latLng(37.14806034900009, 120.97503276500005);
    const maxBounds = L.latLngBounds(bottomleft, topright);
    const qdDefaultOptions = {
      crs,
      center: L.latLng([36.50349, 120.16856]),
      zoom: 0,
      minZoom: 0,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: false,
      inertia: false,
      maxBounds,
      bounceAtZoomLimits: false,
      touchZoom: true // 禁用双个手指缩放（有bug）
    };
    if (options) {
      Object.assign(qdDefaultOptions, options);
    }

    this._map = L.map(container, qdDefaultOptions);


    const _vecBaseLayer = new L.esri.TiledMapLayer({
      url: environment.map.VECTOR_MAP,
      maxZoom: 10,
      minZoom: 0
    });
    const _imgBaseLayer = new L.esri.TiledMapLayer({
      url: environment.map.IMAGE_MAP,
      maxZoom: 10,
      minZoom: 0
    });

    const baseLayers = {
      在线矢量地图: _vecBaseLayer.addTo(this._map),
      在线影像地图: _imgBaseLayer
    };

    // (L.control as any).defaultExtent().addTo(this._map);

    this._layerControl = L.control
      .layers(
        baseLayers,
        {},
        {
          collapsed: true,
          // position: "topleft"
        }
      )
      .addTo(this._map);

    // 初始化地图事件(随UI变化地图更新)
    const that = this;
    this._map.whenReady(() => {
      setTimeout(() => {
        that._map.invalidateSize(true);
      });
      that._map.on("resize", e => {
        that._map.invalidateSize(true);
      });

      that._map.on("viewreset", e => {
        that._map.invalidateSize(true);
      });
    });
    // this.addDrawControl();
    this.addMeasureCtrl();
  }

  addMeasureCtrl() {
    // L.control
    //   .measure({
    //     position: "topleft",
    //     primaryLengthUnit: "meters",
    //     secondaryLengthUnit: undefined,
    //     primaryAreaUnit: "sqmeters",
    //     secondaryAreaUnit: undefined,
    //     activeColor: "#08316F",
    //     completedColor: "#08316F",
    //     localization: "cn"
    //   })
    //   .addTo(this.map);
  }

  addOverlay(layer: any, layerName: string, addToMap: boolean) {
    this._layerControl.addOverlay(layer, layerName);
    if (addToMap) {
      this.map.addLayer(layer);
    }
  }

  zoomToExtent(extent: any) {
    this._map.flyToBounds(extent, { animate: false });
  }

  removeLayer(layer) {
    this.map.removeLayer(layer);
    this.layerControl.removeLayer(layer);
  }

  refresh() {
    setTimeout(() => {
      this._map.invalidateSize();
    }, 500);
  }


}
