import { LeafletService } from "../services/leaflet.service";
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";

import { environment } from "@env/environment";

@Directive({
  selector: "[leaflet]"
})
export class LeafletDirective implements OnInit {

  /** leaflet map options
   */
  @Input() leafletOptions: any;
  /** map loaded event
   */
  @Output() loaded = new EventEmitter<any>();

  private _map;
  private _layerControl;

  public get Map() {
    return this._map;
  }

  public get layerControl() {
    return this._layerControl;
  }

  constructor(private el: ElementRef, private leafletSrv: LeafletService) { }

  // 组件的初始化周期钩子函数
  ngOnInit() {

    this.init(this.el.nativeElement, this.leafletOptions);

  }

  /**
   * 初始化leaflet map
   * @param container 
   * @param options 
   */
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
      矢量地图: _vecBaseLayer.addTo(this._map),
      影像地图: _imgBaseLayer
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

    this._map.on("resize", e => {
      this._map.invalidateSize(true);
    });

    this._map.on("viewreset", e => {
      this._map.invalidateSize(true);
    });

    this._map.whenReady(() => {
      setTimeout(() => {
        this._map.invalidateSize(true);
      });
      this.loaded.emit({
        map: this.Map,
        layerControl: this.layerControl
      });
    })

    // this.addDrawControl();
    // this.addMeasureCtrl();
  }


}
