import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';
import { TaxDataVService } from './../tax-data-v.service';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { COLORS, ColorTypes, getColorRange, order, Point } from '@shared';
import { LoadingService } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '@delon/cache';

import { DEFAULT_SWJG_DM, MAPBOX_POS, IHyItem, ISyjgItem, SYJG, MLMC, DJZCLX, getNsrZsxmDetail } from "../tax-datav-dics";

@Component({
  selector: 'app-bwqyphb',
  templateUrl: './bwqyphb.component.html',
  styleUrls: ['./bwqyphb.component.scss']
})
export class TaxDatavBwqyphbComponent implements OnInit, AfterViewInit {

  // mytest begin
  //#region 计算规上企业纳税规模
  // 计算纳税规模
  BWYS_DATA = [];
  QWYS_DATA = [];
  WBW_QW_DATA = [];
  LBW_WBW_DATA = [];
  YBW_LBW_DATA = [];
  YBWYX_DATA = [];


  curBwqyName;
  // mytest end

  url = `analysis/taxdot`;

  selectedValue = 50; // 所选纳税金额
  selectedHy; // 所选行业

  count = 0;
  totalValue = 0;
  tbzjValue = 0;
  tbzjf = '';

  //#region  规上企业变量、参数

  bwqyUrl = "/gsqy";
  bwqyData = [];
  totalItem = {};
  bwqyCount;
  bwqyCount_BL;
  bwqyTaxValue;
  bwqyTaxValue_BL;

  // 规上企业行业税收
  bwqyHyObj = {};
  bwqySwjgObj = {};
  //#endregion

  //#region 图表

  // 纳税规模
  nsgmChartOpt;
  nsgmChart;
  // 按行业分析
  bwqyHyChartOpt;
  bwqyHyChart;
  // 税务机关分析
  bwqySwjgChartOpt;
  bwqySwjgChart;
  rightTopChartOpt1;
  rightTopChartOpt2;
  rightTopChartOpt3;
  rightTopChartOpt4;
  rightBottomOption;

  MAPBOX_POS = {
    center: [120.8303991378192, 37.10038795930873],
    pitch: 0,
    bearing: -10.441292648171384,
    zoom: 8.056808924835703
  }
  //#endregion

  style = decimal;
  map: mapboxgl.Map;// map 
  heightStop = 20000;
  pointActive = {
    type: 'FeatureCollection',
    features: []
  }
  empty = {
    type: 'FeatureCollection',
    features: []
  }
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'top'
  });
  companyListpopup = new mapboxgl.Popup({
    closeButton: false
  });
  colorActive = "yellow";


  rightBottomTitle = "";
  nsrTaxDetail = {
    BND: 0,
    SNTQ: 0,
    TBZJ: ''
  }

  constructor(public http: _HttpClient,
    private cacheSrv: CacheService,
    private loadSrv: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public taxDataVSrv: TaxDataVService) {

  }


  /* [1]
  ** （1）加载mapbox地图时，运行的函数
  ** （2）选择mapbox地图的风格
  ** （3）在热力图、散点图和聚合图中，做选择
  ** （4）注册地图事件（未看懂）
  ** （5）转移到目标位置
  */
  mapboxLoad(e) {
    this.map = e;
    this.mapboxSwitchMapStyle(this.map);
    this.getBwqyData();
    this.fly2target();
    // 地图样式切换事件监听,切换后续重新加载原专题数据
    this.map.on('styledata', styleData => {

      this.addCityBoundary();
      this.addDistrictBoundary();
      this.addDistrictSymbol(this.BWYS_DATA);


    });

    this.mapboxMapEvent();
  }
  mapboxSwitchMapStyle(map) {
    const styles = [
      {
        title: "灰色风格",
        uri: JSON.stringify(dark)
      },
      {
        title: "科技风格",
        uri: JSON.stringify(decimal)
      }
    ];
    const styleControl = new MapboxStyleSwitcherControl(styles);
    map.addControl(styleControl);
  }
  switchLayer(e) {
    switch (e) {
      case 'heat':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'visible');
        this.map.setLayerZoomRange('dot-layer', 12.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;
      case 'dot':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;

      case 'cluster':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'visible');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;

      default:
        break;
    }
  }
  mapboxMapEvent() {
    this.map.on('mousemove', e => {
      let html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        this.pointActive.features = [queryPt[0]];
        this.map.getCanvas().style.cursor = 'point';
        const { nsrmc, value } = queryPt[0].properties;
        html = `<h5>纳税人名称：${nsrmc}</h5>
        <h5>本年度纳税额：${value}万元</h5>`;
        this.popup.setLngLat([lng, lat]).setHTML(html).addTo(this.map);
      } else {
        this.map.getCanvas().style.cursor = '';
        this.popup.remove();
      }
    });
    this.map.on('mouseleave', e => {
      this.popup.remove();
    });
  }
  fly2target(center?, pitch?, zoom?, bearing?) {

    setTimeout(() => {
      this.map.flyTo({
        center: center ? center : this.MAPBOX_POS.center,
        zoom: zoom ? zoom : this.MAPBOX_POS.zoom,
        bearing: bearing ? bearing : this.MAPBOX_POS.bearing,
        pitch: pitch ? pitch : this.MAPBOX_POS.pitch,
        speed: 0.8
      });
    });
  }
  /* [2]
  ** （1）获取查询条件参数
  ** （2）获取百万企业列表
  */
  getCondition() {
    return {
      year: 2020,
      startMonth: 1,
      endMonth: 9,
      budgetValue: 4,
      value: 50,
    }
  }
  getBwqyData() {
    let year = 2020;
    let startMonth = 1;
    let endMonth = 11;
    let budgetValue0 = [1, 2, 3, 4];
    let value = 100;
    let budgetValue = budgetValue0.toLocaleString();

    this.bwqyUrl = `http://140.68.16.96:10920/api/analysis/taxdot`;
    //this.http.get(this.bwqyUrl, { year, startMonth, endMonth, budgetValue, value }).subscribe(resp => {
    this.http.post("/bwqy", {}).subscribe(resp => {
      this.BWYS_DATA = resp.data;
      const bwqyData = resp.data;
      this.bwqyData = bwqyData.sort(order('BNDSR')).splice(3, 10);
      // 计算总数及比例
      this.bwqyCount = bwqyData.length;
      this.bwqyCount_BL = 2.3;
      this.bwqyTaxValue = bwqyData.map(i => i.BNDSR).reduce((x, y) => x + y);
      this.bwqyTaxValue_BL = Math.floor(this.bwqyTaxValue / 10000) / 100

      bwqyData.forEach(i => {
        i.BNDSR > 1000 ? this.QWYS_DATA.push(i) :
          i.BNDSR > 500 ? this.WBW_QW_DATA.push(i) :
            i.BNDSR > 200 ? this.LBW_WBW_DATA.push(i) :
              i.BNDSR > 100 ? this.YBW_LBW_DATA.push(i) :
                this.YBWYX_DATA.push(i);
      });

      const nsgmPieData = [
        {
          name: '千万以上',
          value: this.QWYS_DATA.length
        },
        {
          name: '五百万至千万',
          value: this.WBW_QW_DATA.length
        },
        {
          name: '两百万至五百万',
          value: this.LBW_WBW_DATA.length
        },
        {
          name: '一百万至两百万',
          value: this.YBW_LBW_DATA.length
        }
      ];

      this.initLeftTopChart(nsgmPieData);

      let mytestDataList = [];
      mytestDataList.push(this.bwqyData[0]["SNTQ"]);
      mytestDataList.push(this.bwqyData[0]["BNDSR"]);
      this.curBwqyName = this.bwqyData[0]["NSRMC"];
      this.initBwqyQyChart(mytestDataList);
      this.initRightTopChart();
      // this.initRightBottomChart();

      const dotData = bwqyData.filter(i => i.lat !== null);
      this.makeGeojsonData(dotData);
      this.initPopup();
    });
  }
  /* [3]
  ** （1）添加城市边界
  ** （2）添加区县边界
  ** （3）添加文字标记
  */
  addCityBoundary() {
    const $stream1 = this.http.get('assets/data/yt/SJ_Polygon.json');
    $stream1.subscribe(resp => {
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
  }
  addDistrictBoundary() {
    const $stream1 = this.http.get('assets/data/yt/SWJG.json');
    $stream1.subscribe(resp => {
      if (!this.map.getSource('current_district_line')) {
        this.map.addSource('current_district_line', {
          type: 'geojson',
          data: resp as any
        });
      }
      if (!this.map.getLayer('current_district_line')) {
        (this.map as any).addLayer({
          "id": "current_district_line",
          "type": "line",
          "source": "current_district_line",
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

  }
  addDistrictSymbol(groupList) {
    this.http.get('assets/data/yt/swjg_point.json').subscribe(resp => {
      var data = resp;
      if (!this.map.getSource('swjg_point_source')) {
        this.map.addSource('swjg_point_source', {
          type: 'geojson',
          data: data as any
        });

      };
      console.log('swjg_point_source', resp);
      console.log("bwqyData:", groupList);

      if (!this.map.getLayer('swjg_point_symbol')) {
        (this.map as any).addLayer({
          "id": "swjg_point_symbol",
          "type": "symbol",
          "source": "swjg_point_source",
          "minzoom": 3,
          "maxzoom": 13,
          'symbol-sort-key': 111,
          layout: {
            //"text-variable-anchor": ["top", "bottom", "left", "right"],
            "visibility": "visible",
            // 'text-field': '{NAME}',
            'text-field': ['format', ['get', 'NAME'],
              {
                "text-font": ['literal', ["Open Sans Bold"]],
                // 'text-color': 'rgb(123,246,250)',
                'text-color': 'rgb(255,255,255)',
                "text-halo-color": "blue",
                "text-halo-blur": 2,
                "text-halo-width": 2,
                'font-scale': 1
              },
              '\n', {},
              ['get', 'COUNT'],
              {
                "text-font": ['literal', ["Open Sans Bold"]],
                'text-color': 'rgb(123,246,250)',
                "text-halo-color": "blue",
                "text-halo-blur": 2,
                "text-halo-width": 2,
                'font-scale': 1
              }
            ],
            'text-size': 15,
            'text-justify': 'center',
            'text-allow-overlap': true
          }
        });
      }
    });
  }

  /**
   * 显示企业详细信息
   */
  qyxxDisplay(x2) {
    this.initRightBottomChart(x2);

    let mytestDataList = [];
    console.log("qyxxDisplay:bwqyData", this.bwqyData);
    this.bwqyData.forEach(i => {

      if (i.NSRMC == x2) {
        this.curBwqyName = x2;
        mytestDataList.push(i.SNTQ);
        mytestDataList.push(i.BNDSR);
        this.initBwqyQyChart(mytestDataList);

        const NSRMC = i.NSRMC;
        const VALUE = i.BNDSR;
        var html = `<h5>纳税人名称：${NSRMC}</h5>
        <h5>本年度纳税额：${VALUE}万元</h5>`;
        this.popup.setLngLat([i.lng, i.lat])
          .setHTML(html)
          .addTo(this.map);
        this.fly2target([i.lng, i.lat], null, 17)
      } else {

      }
    });
  }
  /* [4]
  ** （1）构建空间数据(根据不同的数据集，需要进行修改)
  ** （2）构建散点图
  ** （3）构建热力图
  ** （4）构建聚合图
  ** （5）构建聚合图需要的函数
  ** （6）构建聚合图需要的函数
  */
  makeGeojsonData(data) {
    const values = data.map(i => i.BNDSR);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 构造点集合
    const features = data.map((i, index) => {
      return Point(i.lat, i.lng, {
        nsrmc: i.NSRMC,
        value: i.BNDSR
      })
    });
    const fc = {
      type: 'FeatureCollection',
      features
    };

    console.log("makeGeojsonData(data):", fc);
    this.initDotLayer(fc);
    this.initHeatLayer(fc);
    this.initClusterLayer(fc);

  }
  initDotLayer(fc) {
    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as mapboxgl.GeoJSONSource).setData(fc as any);
      return;
    }
    else {
      this.map.addSource('dot-source', {
        type: 'geojson',
        data: fc as any
      });
      this.map.addLayer({
        id: 'dot-layer',
        type: 'circle',
        minzoom: 12.61,
        source: 'dot-source',
        layout: {
          visibility: 'visible'
        },
        paint: {
          "circle-radius": {
            stops: [[9, 3], [19, 15]]
          },
          "circle-color": {
            property: 'value',
            stops: [
              [0, COLORS.danger[0]],
              [10, COLORS.danger[1]],
              [50, COLORS.danger[2]],
              [100, COLORS.danger[3]],
              [200, COLORS.danger[4]],
              [500, COLORS.danger[5]],
              [800, COLORS.danger[6]],
              [1000, COLORS.danger[7]],
              [5000, COLORS.danger[8]]
            ]
          },
          "circle-opacity": 0.85
        }
      });
    }
  }
  initHeatLayer(fc) {
    if (this.map.getSource('heat-source')) {
      (this.map.getSource('heat-source') as mapboxgl.GeoJSONSource).setData(fc as any);
      return;
    }
    else {
      this.map.addSource('heat-source', {
        type: 'geojson',
        data: fc as any
      });
      this.map.addLayer(
        {
          'id': 'heat-layer',
          'type': 'heatmap',
          'source': 'heat-source',
          'maxzoom': 14,
          'paint': {
            // Increase the heatmap weight based on frequency and property valuenitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              10,
              0,
              10000,
              1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              19,
              4
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgba(32,51,142,1)',
              0.4,
              'rgba(53,115,173,1)',
              0.6,
              'rgba(108,186,194,1)',
              0.65,
              'rgba(198,228,187,1)',
              1,
              'rgba(245,249,198,1)',

            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              12,
              14,
              30
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              12,
              1,
              15,
              0
            ]
          }
        }
      );
    }

  }
  initClusterLayer(data) {
    const that = this;
    const value1 = ['<', ['get', 'value'], 50];
    const value2 = ['all', ['>=', ['get', 'value'], 50], ['<', ['get', 'value'], 100]];
    const value3 = ['all', ['>=', ['get', 'value'], 100], ['<', ['get', 'value'], 500]];
    const value4 = ['all', ['>=', ['get', 'value'], 500], ['<', ['get', 'value'], 1000]];
    const value5 = ['>=', ['get', 'value'], 1000];

    // colors to use for the categories
    const colors = COLORS.danger   // add a clustered GeoJSON source for a sample set of nsr

    if (this.map.getSource('nsr-source')) {
      (this.map.getSource('nsr-source') as mapboxgl.GeoJSONSource).setData(data as any);
      return;
    }
    else {
      this.map.addSource('nsr-source', {
        'type': 'geojson',
        'data': data,
        'cluster': true,
        'clusterRadius': 60,
        'clusterProperties': {
          // keep separate counts for each valuenitude category in a cluster
          'value1': ['+', ['case', value1, 1, 0]],
          'value2': ['+', ['case', value2, 1, 0]],
          'value3': ['+', ['case', value3, 1, 0]],
          'value4': ['+', ['case', value4, 1, 0]],
          'value5': ['+', ['case', value5, 1, 0]]
        }
      });
      // circle and symbol layers for rendering individual nsr (unclustered points)
      this.map.addLayer({
        'id': 'nsr_circle',
        'type': 'circle',
        'source': 'nsr-source',
        'filter': ['!=', 'cluster', true],
        layout: {
          visibility: 'none'
        },
        'paint': {
          'circle-color': [
            'case',
            value1,
            colors[0],
            value2,
            colors[2],
            value3,
            colors[4],
            value4,
            colors[6],
            colors[8]
          ],
          'circle-opacity': 0.6,
          'circle-radius': 12
        }
      });
      this.map.addLayer({
        'id': 'nsr_label',
        'type': 'symbol',
        'source': 'nsr-source',
        'filter': ['!=', 'cluster', true],
        'layout': {
          'text-field': '{value}',
          'text-font': ['微软雅黑'],
          'text-size': {
            stops: [
              [9, 12],
              [14, 15],
              [19, 20]
            ]
          },
          visibility: 'none'
        },
        'paint': {
          'text-halo-color': 'gray',
          'text-halo-width': 1,
          'text-color': '#ffc300'
        }
      });

      // objects for caching and keeping track of HTML marker objects (for performance)
      const markers = {};
      let markersOnScreen = {};

      function updateMarkers() {
        const newMarkers = {};
        const features = that.map.querySourceFeatures('nsr-source');

        // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
        // and add it to the map if it's not there already
        for (let i = 0; i < features.length; i++) {
          const coords = (features[i].geometry as any).coordinates;
          const props = features[i].properties;
          if (!props.cluster) continue;
          const id = props.cluster_id;

          let marker = markers[id];
          if (!marker) {
            const el = that.createDonutChart(props);
            marker = markers[id] = new mapboxgl.Marker(el as HTMLElement).setLngLat(coords);
          }
          newMarkers[id] = marker;

          if (!markersOnScreen[id]) marker.addTo(that.map);
        }
        // for every marker we've added previously, remove those that are no longer visible
        for (const id in markersOnScreen) {
          if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
      }

      // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
      this.map.on('data', e => {
        if (e.sourceId !== 'nsr-source' || !e.isSourceLoaded) return;
        this.map.on('move', updateMarkers);
        this.map.on('moveend', updateMarkers);
        updateMarkers();
      });
    }
  }
  createDonutChart(props) {
    const offsets = [];
    const counts = [
      props.value1,
      props.value2,
      props.value3,
      props.value4,
      props.value5
    ];
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
      offsets.push(total);
      total += counts[i];
    }
    const fontSize =
      total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
    const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    let html =
      '<div><svg width="' +
      w +
      '" height="' +
      w +
      '" viewbox="0 0 ' +
      w +
      ' ' +
      w +
      '" text-anchor="middle" style="font: ' +
      fontSize +
      'px sans-serif; display: block">';

    for (let i = 0; i < counts.length; i++) {
      html += this.donutSegment(
        offsets[i] / total,
        (offsets[i] + counts[i]) / total,
        r,
        r0,
        COLORS.danger[i]
      );
    }
    html +=
      '<circle cx="' +
      r +
      '" cy="' +
      r +
      '" r="' +
      r0 +
      '" fill="white" /><text dominant-baseline="central" transform="translate(' +
      r +
      ', ' +
      r +
      ')">' +
      total.toLocaleString() +
      '</text></svg></div>';

    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
  }
  donutSegment(start, end, r, r0, color) {
    if (end - start === 1) end -= 0.00001;
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
      y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
      y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

    return [
      '<path d="M',
      r + r0 * x0,
      r + r0 * y0,
      'L',
      r + r * x0,
      r + r * y0,
      'A',
      r,
      r,
      0,
      largeArc,
      1,
      r + r * x1,
      r + r * y1,
      'L',
      r + r0 * x1,
      r + r0 * y1,
      'A',
      r0,
      r0,
      0,
      largeArc,
      0,
      r + r0 * x0,
      r + r0 * y0,
      '" fill="' + color + '" />'
    ].join(' ');
  }
  /* [5]
  ** （1）构建左上角饼图
  ** （2）响应左上角饼图的点击事件
  ** （3）响应左上角点击事件，在右下角显示企业详细信息(曾用)
  ** （4）构建左下角点击事件，在地图上显示popup(未用)
  ** （5）构建右上角的仪表盘
  ** （6）构建右下角的柱形图
  */
  initLeftTopChart(seriesData) {

    this.nsgmChartOpt = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      toolbox: {
        show: true,
        feature: {

          saveAsImage: {}
        }
      },
      series: [
        {
          name: '纳税规模',
          type: 'pie',
          radius: ['22%', '45%'],
          minAngle: 20,
          avoidLabelOverlap: true,
          label: {
            formatter: '{b}\n{c}户 ({d}%)',
            color: (params) => {
              // 自定义颜色
              const colorList =
                // COLORS.primary;
                [

                  'rgb(0,78,255)',
                  'rgb(0,108,255)',
                  'rgb(0,138,255)',
                  'rgb(0,168,255)',
                  'rgb(0,198,255)'
                ];
              // console.log(params, colorList[params.dataIndex]);
              return colorList[params.dataIndex]
            }
          },
          itemStyle: {
            normal: {
              color: (params) => {
                // 自定义颜色
                const colorList =
                  //  COLORS.primary;
                  [
                    'rgb(0,78,255)',
                    'rgb(0,108,255)',
                    'rgb(0,138,255)',
                    'rgb(0,168,255)',
                    'rgb(0,198,255)',
                  ];
                // console.log(params, colorList[params.dataIndex]);
                return colorList[params.dataIndex]
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: seriesData
        }
      ]
    };
  }
  initBwqyQyChart(seriesData) {
    console.log("seriesData: ", seriesData);
    this.bwqySwjgChartOpt = {
      backgroundColor: 'transparent',
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['去年', '今年'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: seriesData
        }
      ]
    }
  }
  onChartClick(ec) {
    console.log(ec.name);
    console.log(ec);
    if (ec.name == "千万以上") {
      //更新地图数据
      const dotData = this.QWYS_DATA.filter(i => i.lat !== null);
      this.makeGeojsonData(dotData);
      //更新地图展示数据统计
      this.bwqyCount = ec.value;
      this.bwqyCount_BL = (ec.value / 157956 * 100).toFixed(2);
      this.bwqyTaxValue = 0;
      this.QWYS_DATA.forEach(element => {
        this.bwqyTaxValue = this.bwqyTaxValue + element.BNDSR;
      });
      this.bwqyTaxValue_BL = (this.bwqyTaxValue / 100000000 * 100).toFixed(2);
    } else if (ec.name == "五百万至千万") {
      //更新地图数据
      const dotData = this.WBW_QW_DATA.filter(i => i.lat !== null);
      this.makeGeojsonData(dotData);
      //更新地图展示数据统计
      this.bwqyCount = ec.value;
      this.bwqyCount_BL = (ec.value / 157956 * 100).toFixed(2);
      this.bwqyTaxValue = 0;
      this.WBW_QW_DATA.forEach(element => {
        this.bwqyTaxValue = this.bwqyTaxValue + element.BNDSR;
      });
      this.bwqyTaxValue_BL = (this.bwqyTaxValue / 100000000 * 100).toFixed(2);
    } else if (ec.name == "两百万至五百万") {
      //更新地图数据
      const dotData = this.LBW_WBW_DATA.filter(i => i.lat !== null);
      this.makeGeojsonData(dotData);
      //更新地图展示数据统计
      this.bwqyCount = ec.value;
      this.bwqyCount_BL = (ec.value / 157956 * 100).toFixed(2);
      this.bwqyTaxValue = 0;
      this.LBW_WBW_DATA.forEach(element => {
        this.bwqyTaxValue = this.bwqyTaxValue + element.BNDSR;
      });
      this.bwqyTaxValue_BL = (this.bwqyTaxValue / 100000000 * 100).toFixed(2);
    } else if (ec.name == "一百万至两百万") {
      //更新地图数据
      const dotData = this.YBW_LBW_DATA.filter(i => i.lat !== null);
      this.makeGeojsonData(dotData);
      //更新地图展示数据统计
      this.bwqyCount = ec.value;
      this.bwqyCount_BL = (ec.value / 157956 * 100).toFixed(2);
      this.bwqyTaxValue = 0;
      this.YBW_LBW_DATA.forEach(element => {
        this.bwqyTaxValue = this.bwqyTaxValue + element.BNDSR;
      });
      this.bwqyTaxValue_BL = (this.bwqyTaxValue / 100000000 * 100).toFixed(2);
    } else {

    }
    this.initRightTopChart();
  }
  initPopup() {
    this.map.on('mousemove', 'dot-source', function (e) {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = 'pointer';
      console.log("e:", e);

      // Populate the popup and set its coordinates based on the feature.
      var feature = e.features[0];
      //this.companyListpopup.setLngLat(feature.geometry.coordinates)
      //  .setText(feature.properties.NSRMC + ' (' + feature.properties.BNDSR + ')')
      //  .addTo(this.map);
    });
    this.map.on('mouseleave', 'dot-source', function () {
      this.map.getCanvas().style.cursor = '';
      this.companyListpopup.remove();
    });
  }
  initRightTopChart() {

    this.rightTopChartOpt1 = {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: "{a} <br/>{c}"
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: "mytest",
          type: 'gauge',
          min: 0,
          max: 5000,
          splitNumber: 10,
          radius: '75%',
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.1, 'lime'], [0.9, '#1e90ff'], [1, '#16fcff']],
              width: 3,
              // shadowColor: '#fff', //默认透明
              shadowBlur: 0
            }
          },
          axisLabel: {            // 坐标轴小标记
            // show:false,
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10,
              fontSize: 10
            },
            formatter: function (value) {
              if (value > 100000) {
                return (+value / 10000).toFixed(0) + '万';
              } else {
                return (+value).toFixed(0);
              }
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 10,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {           // 分隔线
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 3
          },
          title: {
            show: false
          },
          detail: {
            borderWidth: 0,
            borderColor: '#fff',
            // shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '110%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 20
            },
            formatter: '企业户数：{value}户'
          },
          data: [{ value: this.bwqyCount, name: '企业户数' }]
        },

      ]
    };
    this.rightTopChartOpt2 = {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: "{a} <br/>{c}"
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: "mytest",
          type: 'gauge',
          min: 0,
          max: 500,
          splitNumber: 10,
          radius: '75%',
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.1, 'lime'], [0.9, '#1e90ff'], [1, '#16fcff']],
              width: 3,
              // shadowColor: '#fff', //默认透明
              shadowBlur: 0
            }
          },
          axisLabel: {            // 坐标轴小标记
            // show:false,
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10,
              fontSize: 10
            },
            formatter: function (value) {
              if (value > 100000) {
                return (+value / 10000).toFixed(0) + '万';
              } else {
                return (+value).toFixed(0);
              }
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 10,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {           // 分隔线
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 3
          },
          title: {
            show: false
          },
          detail: {
            borderWidth: 0,
            borderColor: '#fff',
            // shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '110%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 20
            },
            formatter: '累计税收：{value}亿'
          },
          data: [{ value: (this.bwqyTaxValue / 10000).toFixed(2), name: '累计税收' }]
        },

      ]
    };
    this.rightTopChartOpt3 = {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: "{a} <br/>{c}"
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: "mytest",
          type: 'gauge',
          min: 0,
          max: 100,
          splitNumber: 10,
          radius: '75%',
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.1, 'lime'], [0.9, '#1e90ff'], [1, '#16fcff']],
              width: 3,
              // shadowColor: '#fff', //默认透明
              shadowBlur: 0
            }
          },
          axisLabel: {            // 坐标轴小标记
            // show:false,
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10,
              fontSize: 10
            },
            formatter: function (value) {
              if (value > 100000) {
                return (+value / 10000).toFixed(0) + '万';
              } else {
                return (+value).toFixed(0);
              }
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 10,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {           // 分隔线
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 3
          },
          title: {
            show: false
          },
          detail: {
            borderWidth: 0,
            borderColor: '#fff',
            // shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '110%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 20
            },
            formatter: '户数占比：{value}%'
          },
          data: [{ value: this.bwqyCount_BL, name: '户数占比' }]
        },

      ]
    };
    this.rightTopChartOpt4 = {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: "{a} <br/>{c}"
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: "mytest",
          type: 'gauge',
          min: 0,
          max: 100,
          splitNumber: 10,
          radius: '75%',
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.1, 'lime'], [0.9, '#1e90ff'], [1, '#16fcff']],
              width: 3,
              // shadowColor: '#fff', //默认透明
              shadowBlur: 0
            }
          },
          axisLabel: {            // 坐标轴小标记
            // show:false,
            textStyle: {       // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10,
              fontSize: 10
            },
            formatter: function (value) {
              if (value > 100000) {
                return (+value / 10000).toFixed(0) + '万';
              } else {
                return (+value).toFixed(0);
              }
            }
          },
          axisTick: {            // 坐标轴小标记
            length: 10,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {           // 分隔线
            length: 15,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#fff',
              // shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          pointer: {           // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 3
          },
          title: {
            show: false
          },
          detail: {
            borderWidth: 0,
            borderColor: '#fff',
            // shadowColor: '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '110%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 20
            },
            formatter: '收入比重：{value}%'
          },
          data: [{ value: this.bwqyTaxValue_BL, name: '收入比重' }]
        },

      ]
    };
  }
  initRightBottomChart(nsrmc) {
    //默认选中第一条
    setTimeout(() => {
      this.rightBottomTitle = nsrmc;
    }, 100);
    getNsrZsxmDetail(this.http, nsrmc).subscribe(resp => {

      // 分税种明细
      const zsxmMap = new Map(Object.entries(resp[0].data).filter(item => item[1] !== 0));
      // const zsxmData = (Object as any).fromEntries(zsxmMap);
      const zsxmKeys = Object.keys(resp[0].data);
      const zsxmValues = Object.values(resp[0].data);

      // 设置 pie 数据
      const pieData = zsxmKeys.map((key, index) => {
        return {
          name: key,
          value: zsxmValues[index]
        }
      }).filter(item => item.value !== 0).sort(order('value'));

      this.rightBottomOption = {
        backgroundColor: 'transparent',
        color: COLORS.info,
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: '分税种税收',
            type: 'pie',
            radius: ['20%', '70%'],
            roseType: 'area',
            avoidLabelOverlap: true,
            label: {
              formatter: '{b}({d}%)'
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  // 自定义颜色
                  const colorList =
                    COLORS.info;

                  return colorList[params.dataIndex]
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: pieData
          }
        ]
      };

      // 获取历年税收
      const taxByYearData = resp[1].data.sort(order('YEAR'))
      this.nsrTaxDetail.BND = taxByYearData[0].VALUE;
      if (taxByYearData[1].VALUE) {
        this.nsrTaxDetail.SNTQ = taxByYearData[1].VALUE;
        this.nsrTaxDetail.TBZJ = `${Math.round((this.nsrTaxDetail.BND - this.nsrTaxDetail.SNTQ) / this.nsrTaxDetail.SNTQ * 10000) / 100}%`;

      }
    });

  }
  /*  [x]
  ** （1）不知道是什么的函数声明
  ** （2）TaxDatavMjsh0Component的接口的实现
  */
  _onReuseDestroy: () => void;
  destroy: () => void;
  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.taxDataVSrv.title = '规上企业分布图';
    });
  }
}

