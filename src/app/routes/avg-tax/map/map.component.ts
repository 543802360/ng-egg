import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage } from '@delon/abc/st';

import { NzMessageService, NzTreeSelectComponent, properties } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark_T as dark, decimal_T as decimal } from '@geo';
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel, ColorTypes, COLORS, order } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService, ReuseComponentInstance } from '@delon/abc';
import { CacheService } from '@delon/cache';

// mapbox pos参数
const MAPBOX_POS = {
  center: [120.65733652344079, 37.000723396581805],
  pitch: 40,
  bearing: -10.441292648171384,
  zoom: 8.056808924835703
}

// 税收分级次item接口
interface ssfjcItem {
  "ALL_VALUE": number,
  "TDS": number,
  "ZDMJ_M": number,
  "JGDM": string,
  "SWJGJC": string,
  "MJSS": number

}
@Component({
  selector: 'app-avg-tax-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class AvgTaxMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  url = `analysis/county`;
  style = decimal;

  map: mapboxgl.Map;
  leafletMap;
  layerControl;
  mapOptions: {
    center: [37.39471, 120.9709],
    zoom: 9
  };
  // 行业名称tree-select
  hymcNodes;
  selectedHymc: string;

  @ViewChild('st') st: STComponent;
  @ViewChild('expandSt') expandSt: STComponent;
  ssfjcData: ssfjcItem[] = [];
  tooltipStyle = { 'max-width': '400px' };
  columns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      width: 60,
      className: 'text-center',
      render: 'order-tpl'
    },
    {
      title: '税务机关',
      index: 'SWJGJC',
      className: 'text-center'
    },
    {
      title: '占地企业税收',
      index: 'ALL_VALUE',
      type: 'number',
      className: 'text-center',
      sort: {
        compare: (a, b) => {
          const val1 = a.ALL_VALUE;
          const val2 = b.ALL_VALUE;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    },
    {
      title: '金三登记土地数',
      index: 'TDS',
      type: 'number',
      className: 'text-center',
      sort: {
        compare: (a, b) => {
          const val1 = a.TDS;
          const val2 = b.TDS;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    },
    {
      title: '金三登记土地面积(亩)',
      className: 'text-center',
      index: 'ZDMJ_M',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.ZDMJ_M;
          const val2 = b.ZDMJ_M;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    },
    {
      title: '亩均税收(万元/亩)',
      className: 'text-center',
      index: 'MJSS',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.MJSS;
          const val2 = b.MJSS;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    }
    // {
    //   title: '',
    //   buttons: [
    //   ]
    // }
  ];
  expandStData: any[];

  expandColumns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      render: 'order-tpl',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.expandSt.pi - 1) * this.expandSt.ps + index + 1}`;

      }

    },
    {
      index: 'NSRMC',
      title: '公司名称',
      className: 'text-center',
    },
    {
      index: 'MLMC',
      title: '所属行业',
      className: 'text-center',
    },
    {
      index: 'ALL_VALUE',
      title: '税收(元)',
      className: 'text-center',
      width: 120
    },
    {
      index: 'YSTDMJ',
      title: '占地面积(亩)',
      className: 'text-center',
      width: 130
    },
    {
      index: 'MJSS',
      title: '亩均税收(万元/亩)',
      className: 'text-center',
      type: 'number',
      width: 165
    },


  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }
  heightStop = 20000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  fillActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "gold";
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: "top"
  });
  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private cacheSrv: CacheService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService) { }
  _onReuseDestroy: () => void;
  destroy: () => void;
  ngOnInit() {
    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });
  }

  /**
 * 复用路由初始化，重复进入时
 */
  _onReuseInit() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      });
    }
  }

  ngAfterViewInit() {
    // this.loadSrv.open({ text: '正在处理……' });

  }

  /**
   * 获取区域聚合数据
   */
  getData() {
    const $stream2 = this.http.get('assets/data/yt/SWJG.json');

    let mjssJson;
    switch (this.selectedHymc) {
      case 'C':
        mjssJson = 'assets/data/yt/亩均税收-税务机关-门类-制造业.json'
        break;
      case 'E':
        mjssJson = 'assets/data/yt/亩均税收-机关-门类-建筑业.json'
        break;
      case 'K':
        mjssJson = 'assets/data/yt/亩均税收-机关-门类-房地产业.json'
        break;
      case 'G':
        mjssJson = 'assets/data/yt/亩均税收-机关-门类-交通运输仓储和邮政业.json'
        break;
      default:
        mjssJson = 'assets/data/yt/亩均税收--税务机关分析.json';
        break;
    }
    console.log(this.selectedHymc);
    const $stream1 = this.http.get(mjssJson);
    // 3、构造专题数据
    forkJoin([$stream1, $stream2])
      .subscribe(resp => {
        // 税款国库geo数据
        const skgkResp = resp[1];
        // 税收分级次数据
        const ssfjcData: ssfjcItem[] = resp[0].RECORDS;
        // 4、获取烟台市统计数据
        // this.totalItem = ssfjcData.find(i => i.SWJG_MC === '烟台市');
        // this.cacheSrv.set('totalTax', this.totalItem);
        // 5、合并税款数据至properties
        skgkResp.features.forEach(el => {
          const target = ssfjcData.find(i => i.SWJGJC.includes(el.properties.SWJGJC.trim()));
          Object.assign(el.properties, target);
        });
        this.ssfjcData = skgkResp.features.map(i => i.properties).sort(order('MJSS'));
        // 6、加载geo
        const taxValues = ssfjcData.filter(i => i.SWJGJC !== '烟台市').map(i => i['MJSS']);

        const taxMax = Math.max(...taxValues);
        const taxMin = Math.min(...taxValues);

        const colorStops = getColorRange(taxMin, taxMax, ColorTypes.info);


        if (!this.map.getSource('ssfjc-source')) {
          this.map.addSource('ssfjc-source', {
            'type': 'geojson',
            'data': skgkResp as any
          });
        } else {
          (this.map.getSource('ssfjc-source') as any).setData(skgkResp as any);
        }

        if (!this.map.getLayer('ssfjc-extrusion-layer')) {
          this.map.addLayer({
            'id': 'ssfjc-extrusion-layer',
            'type': 'fill-extrusion',
            'source': "ssfjc-source",
            'paint': {
              // "fill-extrusion-color": "hsl(55, 1%, 17%)",
              "fill-extrusion-color": {
                property: "MJSS",
                stops: colorStops
              },
              "fill-extrusion-height": {
                property: "MJSS",
                stops: [[taxMin, 0], [taxMax, this.heightStop]]
              },
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 0.7,
              "fill-extrusion-height-transition": {
                duration: 2000
              },
              "fill-extrusion-color-transition": {
                duration: 2000
              }
            }
          });
        }

        // 添加高亮数据源及图层

        if (!this.map.getSource('grid-active')) {
          this.map.addSource("grid-active", {
            type: "geojson",
            data: this.gridActive as any
          });
        }
        if (!this.map.getSource('fill-active')) {
          this.map.addSource("fill-active", {
            type: "geojson",
            data: this.fillActive as any
          });
        }
        if (!this.map.getLayer('grid-active')) {
          this.map.addLayer({
            id: "grid-active",
            type: "fill-extrusion",
            source: "grid-active",
            paint: {
              "fill-extrusion-color": this.colorActive,
              "fill-extrusion-height": {
                property: "SE_HJ_LJ_BQ",
                stops: [[taxMin, 0], [taxMax, this.heightStop]]
              },
              "fill-extrusion-opacity": 0.9,
              "fill-extrusion-height-transition": {
                duration: 1500
              },
              "fill-extrusion-color-transition": {
                duration: 1500
              }
            }
          });
        }
        if (!this.map.getLayer('fill-active')) {
          this.map.addLayer({
            id: "fill-active",
            type: "fill",
            source: "fill-active",
            paint: {
              "fill-color": 'yellow',
              "fill-opacity": 0.0,
            }
          });
        }

        setTimeout(() => {
          this.fly2target();
        });
      });
  }


  /**
   * mapbox load
   * @param e 
   */
  mapboxLoad(e) {
    this.loadSrv.close();
    this.map = e;
    (window as any).map = this.map;
    setTimeout(() => {
      this.getData();
      // this.fly2target();
    });

    (window as any).map = e;
    this.http.get('assets/data/yt/SWJG.json').subscribe(resp => {
      if (!this.map.getSource('current_city_line')) {
        this.map.addSource('current_city_line', {
          type: 'geojson',
          data: resp as any
        });
      }
      if (!this.map.getLayer('current_city_line')) {
        (this.map as any).addLayer({
          "id": "current_city_line",
          "type": "line",
          "source": "current_city_line",
          "minzoom": 3,
          "maxzoom": 13,
          "layout": {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "visible"
          },
          "paint": {
            "line-dasharray": {
              "base": 1,
              "stops": [
                [6, [2, 0]],
                [8, [2, 2, 6, 2]]
              ]
            },
            "line-width": {
              "base": 1,
              "stops": [
                [7, 2],
                [14, 2.8]
              ]
            },
            "line-color": "rgb(193,148,94)"
          }
        });
      }
    });

    this.addMouseMove();
    this.map.on("click", e => {
      let html = "";
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: ["ssfjc-extrusion-layer"]
      });
      if (queryPoint.length) {
        const target = queryPoint[0];
        const { ALL_VALUE, TDS, ZDMJ_M, MJSS, SWJGJC } = target.properties;
        if (SWJGJC === '烟台高新区税务局') {

          this.fly2target([121.51471902263893, 37.41864696724859], null, 12.652);
          /***
           * 
           * map.getZoom()
          12.65260497374872
            map.getCenter()
            Vl {lng: 121.51471902263893, lat: 37.41864696724859}
           * 
           * 
           */
          this.http.get('assets/data/yt/gxq_mjss.json').subscribe(resp => {

            // 添加leaflet 地图 风险地图
            this.addLeafletPolygon(resp);

            this.expandStData = resp.features.map(i => i.properties).sort(order('MJSS'));
            if (!this.map.getSource('mjss-source')) {
              this.map.addSource('mjss-source', {
                type: 'geojson',
                data: resp as any
              });
            }
            if (!this.map.getLayer('mjss-layer')) {

              const taxValues = resp.features.map(i => i.properties['MJSS']);
              const taxMax = Math.max(...taxValues);
              const taxMin = Math.min(...taxValues);

              const colorStops = getColorRange(taxMin, taxMax, ColorTypes.danger);

              (this.map as any).addLayer({
                'id': 'mjss-layer',
                'type': 'fill',
                'source': "mjss-source",
                'paint': {
                  // "fill-extrusion-color": "hsl(55, 1%, 17%)",
                  "fill-color": {
                    property: "MJSS",
                    stops: colorStops
                  },
                  "fill-opacity": 0.7,
                }
              });

              setTimeout(() => {
                this.addMouseMove('mjss-layer');
              });
            } else {
              this.map.setLayoutProperty('mjss-layer', 'visibility', 'visible');
            }
          });

          this.map.setLayoutProperty('ssfjc-extrusion-layer', 'visibility', 'none');
          this.map.setLayoutProperty('grid-active', 'visibility', 'none');

        }

      } else {

        this.map.setLayoutProperty('ssfjc-extrusion-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('grid-active', 'visibility', 'visible');
        this.map.setLayoutProperty('mjss-layer', 'visibility', 'none');

        this.fly2target();
      }
    });


  }
  /**
   * 注册mouse move事件
   * @param layername 
   */
  addMouseMove(layername?: string) {
    this.map.on("mousemove", e => {
      let html = "";
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: layername ? [layername, "ssfjc-extrusion-layer"] : ["ssfjc-extrusion-layer"]
      });
      if (queryPoint.length) {

        if (queryPoint[0].layer.id === 'mjss-layer') {
          const target = queryPoint[0];
          const { ALL_VALUE, NSRMC, MLMC, DWSE, TDYT, YSTDMJ, MJSS, SWJGJC } = target.properties;
          this.fillActive.features = [target];
          (this.map.getSource("fill-active") as any).setData(this.fillActive);
          this.map.getCanvas().style.cursor = "pointer";
          html = `
          <h5>纳税人：${NSRMC}</h5>
            <h5>税务机关：${SWJGJC}</h5>
            <h5>所属行业：${MLMC}</h5>
            <h5>土地用途：${TDYT}</h5>
            <h5>占地面积：${(YSTDMJ)}亩</h5>
            <h5>单位税额：${DWSE}元/平方米</h5>
            <h5>亩均税收：${Math.round(MJSS * 100) / 100}万元/亩</h5>`;

          this.popup
            .setLngLat(coords as any)
            .setHTML(html)
            .addTo(this.map);
        } else {
          const target = queryPoint[0];
          const { ALL_VALUE, TDS, ZDMJ_M, MJSS, SWJGJC } = target.properties;
          this.gridActive.features = [target];
          (this.map.getSource("grid-active") as any).setData(this.gridActive);
          this.map.getCanvas().style.cursor = "pointer";
          html = `<h5>税务机关：${SWJGJC}</h5>
            <h5>金三登记土地数目：${(TDS).toLocaleString()}块</h5>
            <h5>金三登记总占地面积：${(ZDMJ_M)}亩</h5>
            <h5>占地企业总税收：${ALL_VALUE}万元</h5>
            <h5>亩均税收：${Math.round(MJSS * 100) / 100}万元/亩</h5>`;

          this.popup
            .setLngLat(coords as any)
            .setHTML(html)
            .addTo(this.map);
        }



      } else {
        (this.map.getSource("grid-active") as any).setData(this.empty);
        (this.map.getSource("fill-active") as any).setData(this.empty);

        this.map.getCanvas().style.cursor = "";
        this.popup.remove();
      }
    });
  }

  /**
  * ng-alain st change event :click 、expand es
  * @param e 
  */
  stChange(e) {
    console.log(e);
    switch (e.type) {
      case "expand":
        const { SWJGJC } = e.expand;
        if (SWJGJC === '烟台高新区税务局') {
          this.expandStData = this.expandStData;
          console.log(this.expandStData);
        } else {
          this.expandStData = [];
        }
        break;
      case "click":

        setTimeout(() => {
          // this.fly2target([e.click.item.LNG, e.click.item.LAT], null, 17, null);
        });
        break;
      default:
        break;
    }

  }

  fly2target(center?, pitch?, zoom?, bearing?) {
    // this.map.fitBounds([[122.76816719294169, 40.48973849172634], [117.32389362527101, 35.63256594857987]]);

    setTimeout(() => {
      this.map.flyTo({
        center: center ? center : MAPBOX_POS.center,
        zoom: zoom ? zoom : MAPBOX_POS.zoom,
        bearing: bearing ? bearing : MAPBOX_POS.bearing,
        pitch: pitch ? pitch : MAPBOX_POS.pitch,
        speed: 0.8
      });
    });
  }

  /**
 * leaflet map load event
 * @param e 
 */
  leafletMapload(e) {
    const { map, layerControl } = e;
    this.leafletMap = map;
    this.layerControl = layerControl;
    (window as any).leafletMap = map;

  }
  /**
   * 添加leaflet 亩均税收多边形图层
   * @param geojson 
   */
  addLeafletPolygon(geojson) {
    // this.leafletMap.add
    this.leafletMap.setView([37.4236, 121.5343], 15);

    const mjssLayer = L.geoJSON(geojson, {
      style: (feature) => {
        const color = this.getColor(feature.properties.MJSS);
        return {
          fillColor: this.getColor(feature.properties.MJSS),
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.9
        }
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', e => {
          const { ALL_VALUE, NSRMC, MLMC, DWSE, TDYT, YSTDMJ, MJSS, SWJGJC } = feature.properties;
          const html = `
          <h5>纳税人：${NSRMC}</h5>
            <h5>税务机关：${SWJGJC}</h5>
            <h5>所属行业：${MLMC}</h5>
            <h5>土地用途：${TDYT}</h5>
            <h5>占地面积：${(YSTDMJ)}亩</h5>
            <h5>单位税额：${DWSE}元/平方米</h5>
            <h5>亩均税收：${Math.round(MJSS * 100) / 100}万元/亩</h5>`;
          layer.bindPopup(html);
        })
      }
    }).addTo(this.leafletMap);
    this.layerControl.addOverlay(mjssLayer, '亩均税收图层');

    this.http.get('assets/data/yt/YT_FXFX.json').subscribe(resp => {
      const fxfxLayer = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: 'red',
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', e => {
            const { TDSYBH, NSRSBH, NSRMC, FXLX, HCSL, HCMJ, SBMJ } = feature.properties;
            const html = `
            <h5>纳税人名称：${NSRMC}</h5>
              <h5>土地税源编号：${TDSYBH}</h5>
              <h5>风险类型：${FXLX}</h5>
              <h5>单位税额：${HCSL}</h5>
              <h5>金三申报面积：${SBMJ}平方米</h5>
              <h5 style="color:red">实际占地面积：${(HCMJ)}平方米</h5>
              <h5 style="color:red">面积差额：${ Math.floor((HCMJ - SBMJ) * 100) / 100}平方米</h5>
              `;
            layer.bindPopup(html);
          })
        }
      }).addTo(this.leafletMap);
      this.layerControl.addOverlay(fxfxLayer, '土地税源疑点');
    });

  }

  /**
   * 亩均税收颜色获取
   * @param d 
   */
  getColor(d) {
    // const d = parseFloat(feature.properties.MJSS);
    const color = d > 70 ? COLORS.danger[8] :
      d > 60 ? COLORS.danger[7] :
        d > 50 ? COLORS.danger[6] :
          d > 40 ? COLORS.danger[5] :
            d > 30 ? COLORS.danger[4] :
              d > 20 ? COLORS.danger[3] :
                d > 10 ? COLORS.danger[2] :
                  d > 5 ? COLORS.danger[1] : COLORS.danger[0];
    return color;
  }
}
