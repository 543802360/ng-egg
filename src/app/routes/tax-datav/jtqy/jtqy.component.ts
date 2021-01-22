import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';
import { TaxDataVService } from '../tax-data-v.service';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { COLORS, ColorTypes, getColorRange, order, Point } from '@shared';
import { LoadingService } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '@delon/cache';
import { DEFAULT_SWJG_DM, MAPBOX_POS, IHyItem, ISsfjcItem, IZsxmItem, SYJG, MLMC } from "../tax-datav-dics";

const SWJG = [
  ["烟台经济开发区税务局", "烟台经济技术开发区"],
  ["龙口市税务局", "龙口市"],
  ["烟台市芝罘区税务局", "芝罘区"],
  ["莱州市税务局", "莱州市"],
  ["招远市税务局", "招远市"],
  ["烟台市莱山区税务局", "莱山区"],
  ["烟台福山税务局", "福山区"],
  ["蓬莱市税务局", "蓬莱市"],
  ["烟台保税港区税务局", "保税港区"],
  ["莱阳市税务局", "莱阳市"],
  ["烟台牟平税务局", "牟平区"],
  ["海阳市税务局", "海阳市"],
  ["烟台高新区税务局", "烟台高新技术产业开发区"],
  ["栖霞市税务局", "栖霞市"],
  ["长岛县税务局", "长岛县"]
]

@Component({
  selector: 'app-jtqy',
  templateUrl: './jtqy.component.html',
  styleUrls: ['./jtqy.component.scss']
})
export class TaxDatavJtqyComponent implements OnInit, AfterViewInit {

  jtdataUrl = 'datacenter/default/jtss'; //集团
  jtqydataUrl = 'datacenter/default/jtzgsss'; //集团企业
  // 添加区县文字标注
  pointActive = {
    type: 'FeatureCollection',
    features: []
  }
  // 构建集团企业，和其子公司数据
  JtqyData_md = []; //名单
  ZgsData_zb = []; //名单，带坐标的数据
  // 当前选择的集团企业的子公司列表
  ZgsCurData = [];
  // 当前选择的集团企业
  curGNAME = "";
  // 当前选择的Group的统计数字
  curStatistics = {
    curGNAME: "",
    curBNDSR: 0,         //本年度收入
    curSNTQ: 0,          //上年同期
  };
  // 当前选择的子公司名称
  curZgsName = "";
  companyNum = 0;
  // // 构建echart的option，（右上角）
  rightTopChartOpt1;
  rightTopChartOpt3;
  // 构建echart的option，子公司（右下角）
  echartsZgsOpt;

  // 构建mapbox地图
  map: mapboxgl.Map;
  style = decimal;

  // 构建mapbox地图弹出框
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'top'
  });

  // 构建http对象
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
  ** （4）转移到目标位置
  ** （5）注册地图事件
  */
  mapboxLoad(e) {
    this.map = e;
    (window as any).map = this.map;

    this.initData();

    this.fly2target();
    this.mapboxMapEvent();
    this.mapboxAddDistrinctBoundary();

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
  fly2target(center?, pitch?, zoom?, bearing?) {
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
  mapboxMapEvent() {
    this.map.on('mousemove', e => {
      let html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        //this.pointActive.features = [queryPt[0]]; //使用dot-layer的数据
        this.map.getCanvas().style.cursor = 'point';
        console.log("queryPt[0].properties", queryPt[0].properties);
        const { jtmc, nsrmc, VALUE } = queryPt[0].properties;
        html = `<h5>纳税人名称：${nsrmc}</h5>
        <h5>所属集团名称：${jtmc}</h5>
        <h5>本年度纳税额：${VALUE}万元</h5>`;
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
  /* [2]
  ** （1）获取查询条件参数
  ** （2）获取集团企业名单（来源：征管提供的excel）
  ** （3）获取子公司列表(数据中台，带税务数据的)（3调用2、4）
  ** （4）获取子公司列表(本地，带坐标数据的)
  ** （5）展示子公司列表（初始化地图时，地图不跳转）
  ** （5）展示子公司列表
  ** （5）计算统计数（右上角）
  */
  getCondition() {
    const now = new Date();
    const year = now.getFullYear();
    const startMonth = 1;
    const endMonth = now.getMonth() + 1;
    return {
      year,
      startMonth,
      endMonth,
      budgetValue: [1, 2, 3, 4].toLocaleString(),
    }
  }
  /**
   *  初始化集团+集团子公司数据
   **/
  initData(swjg_dm?: string) {

    // 获取集团名单、子公司名单+税收
    const $stream1 = this.http.get(this.jtdataUrl);
    const $stream2 = this.http.get(this.jtqydataUrl);
    forkJoin([$stream1, $stream2]).subscribe(respAll => {
      // 集团、子公司名录
      this.JtqyData_md = respAll[0];
      this.ZgsData_zb = respAll[1];
      this.makeGeojsonData(this.ZgsData_zb);

      // 初始化右上角的数据
      this.rightUpDistinctStatistics(this.JtqyData_md);
      this.companyNum = this.JtqyData_md.length;

      // 获取集团企业数据，集团企业的数据需要子公司的数据进行校对
      this.displayZqyofJtqy0(this.JtqyData_md[0].jtmc);
    });


  }

  displayZqyofJtqy0(str) {
    this.ZgsCurData = [];
    this.ZgsData_zb.forEach(el => {
      if (el.jtmc == str) {
        this.ZgsCurData.push(el);
      } else {

      }
    });
    this.ZgsCurData.sort(order('bndsr'));
    // 右上角户数
    this.initRightTopChart();
    // 清空右下角echarts的数据
    this.curZgsName = "";
    this.initZgsChart([0, 0]);
    this.respClickZgsList0(this.ZgsCurData[0].nsrmc);
  }
  /**
   * 集团点击事件处理
   * @param str 
   */
  jtClickHandler(jtmc) {
    this.curGNAME = jtmc;
    this.ZgsCurData = [];
    this.ZgsData_zb.forEach(el => {
      if (el.jtmc == jtmc) {
        this.ZgsCurData.push(el);
      } else {

      }
    });
    this.ZgsCurData.sort(order('bndsr'));
    // 在地图，显示集团企业的分布
    this.makeGeojsonData(this.ZgsCurData);
    // 更新当前展示的Group统计数据
    this.rightUpDistinctStatistics(this.ZgsCurData);
    //
    this.companyNum = this.ZgsCurData.length;
    this.initRightTopChart();
    // 清空右下角echarts的数据
    this.curZgsName = "";
    this.initZgsChart([0, 0]);
    this.respClickZgsList0(this.ZgsCurData[0]['nsrmc']);
  }
  /**
   * 计算集团+企业统计面板【右上角】
   * @param dataList 
   */
  rightUpDistinctStatistics(dataList) {
    this.companyNum = dataList.length;
    this.curStatistics.curGNAME = "";
    this.curStatistics.curBNDSR = 0;
    this.curStatistics.curSNTQ = 0;
    dataList.forEach(el => {
      this.curStatistics.curGNAME = el.jtmc;
      this.curStatistics.curBNDSR += el.bndsr;
      this.curStatistics.curSNTQ += el.sntq;
    });
    setTimeout(() => {
      this.curStatistics = { ...this.curStatistics };
    });
  }
  /* [3]
  ** （1）添加区县边界
  ** （2）添加文字标记
  */
  mapboxAddDistrinctBoundary() {
    this.http.get('assets/data/yt/SKGK.geojson').subscribe(resp => {
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
      this.mapboxAddDistrictSymbol();
    });
  }
  mapboxAddDistrictSymbol() {
    this.http.get('assets/data/yt/swjg_point.json').subscribe(resp => {
      if (!this.map.getSource('swjg_point_source')) {
        this.map.addSource('swjg_point_source', {
          type: 'geojson',
          data: resp as any
        });
      }
      if (!this.map.getLayer('swjg_point_symbol')) {
        (this.map as any).addLayer({
          "id": "swjg_point_symbol",
          "type": "symbol",
          "source": "swjg_point_source",
          "minzoom": 3,
          "maxzoom": 13,
          'symbol-sort-key': 111,
          layout: {
            // 'text-field': '{NAME}',
            'text-field': ['format', ['get', 'NAME'],
              {
                "text-font": ['literal', ["Open Sans Bold"]],
                // 'text-color': 'rgb(123,246,250)',
                'text-color': 'rgb(255,255,255)',
                "text-halo-color": "white",
                "text-halo-blur": 2,
                "text-halo-width": 2,
                'font-scale': 1
              },
              '\n', {},
              ['get', 'COUNT'],
              {
                "text-font": ['literal', ["Open Sans Bold"]],
                'text-color': 'rgb(123,246,250)',
                "text-halo-color": "white",
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

  /* [4]
  ** （1）构建空间数据(根据不同的数据集，需要进行修改)
  **        ！数组元素需要GNAME、NSRMC、BNDSR、LAT、LNG的必要属性
  **        ！地图对象，以“map”命名       
  ** （2）构建散点图
  ** （3）构建热力图
  ** （4）构建聚合图
  ** （5）构建聚合图需要的函数
  ** （6）构建聚合图需要的函数
  */
  makeGeojsonData(data) {
    //const data = data0.filter(i => i.lat !== null);
    const values = data.map(i => i.bndsr);
    console.log("values :", values);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 构建geoJson，删除无坐标的点
    const features = data.filter(i => i.lat && i.lng).map((i, index) => {
      return Point(Number(i.lat), Number(i.lng), {
        jtmc: i.jtmc,
        nsrmc: i.nsrmc,
        VALUE: i.bndsr
      })
    });
    const geoJson = {
      type: 'FeatureCollection',
      features
    };
    console.log("data:", data);
    console.log("geoJson:", geoJson);

    this.initDotLayer(geoJson);
    this.initClusterLayer(geoJson);
    this.initHeatLayer();
  }
  initDotLayer(fc) {
    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as any).setData(fc);
      return;
    }
    else {
      this.map.addSource('dot-source', {
        type: 'geojson',
        data: fc as any
      });
      //const colorStops = getColorRange(min, max, ColorTypes.success)
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
            property: 'VALUE',
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
  initHeatLayer() {
    if (this.map.getLayer('heat-layer')) {
      return;
    }
    this.map.addLayer(
      {
        'id': 'heat-layer',
        'type': 'heatmap',
        'source': 'dot-source',
        'maxzoom': 14,
        'paint': {
          // Increase the heatmap weight based on frequency and property valuenitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'VALUE'],
            10,
            0,
            1000,
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
            5
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
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            10,
            14,
            28
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

    //this.mapboxAddDistrictSymbol();

  }
  initClusterLayer(data) {

    const that = this;
    const value1 = ['<', ['get', 'VALUE'], 50];
    const value2 = ['all', ['>=', ['get', 'VALUE'], 50], ['<', ['get', 'VALUE'], 100]];
    const value3 = ['all', ['>=', ['get', 'VALUE'], 100], ['<', ['get', 'VALUE'], 500]];
    const value4 = ['all', ['>=', ['get', 'VALUE'], 500], ['<', ['get', 'VALUE'], 1000]];
    const value5 = ['>=', ['get', 'VALUE'], 1000];

    // colors to use for the categories
    const colors = COLORS.danger   // add a clustered GeoJSON source for a sample set of nsr

    if (this.map.getSource('nsr')) {
      (this.map.getSource('nsr') as any).setData(data);
      return;
    }

    this.map.addSource('nsr', {
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
      'source': 'nsr',
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
      'source': 'nsr',
      'filter': ['!=', 'cluster', true],
      'layout': {
        'text-field': '{VALUE}',
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
      const features = that.map.querySourceFeatures('nsr');

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
      if (e.sourceId !== 'nsr' || !e.isSourceLoaded) return;
      this.map.on('move', updateMarkers);
      this.map.on('moveend', updateMarkers);
      updateMarkers();
    });
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
  ** （1）构建子公司直方图
  ** （2）*初始化使用，显示第一个集团和子公司的信息
  ** （2）响应点击子公司列表的事件
  ** （3）构建右上角仪表盘
  */
  initZgsChart(seriesData) {
    console.log("seriesData: ", seriesData);
    this.echartsZgsOpt = {
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
  respClickZgsList0(str) {
    this.curZgsName = str;
    this.ZgsData_zb.forEach(el => {
      if (el.nsrmc == str) {
        let seriesDataList = [];
        seriesDataList.push(el.sntq);
        seriesDataList.push(el.bndsr);
        this.initZgsChart(seriesDataList);
      } else {
      }
    });

  }
  respClickZgsList(str) {
    this.curZgsName = str;
    this.ZgsData_zb.forEach(el => {
      if (el.nsrmc == str) {
        let seriesDataList = [];
        seriesDataList.push(el.sntq);
        seriesDataList.push(el.bndsr);
        this.initZgsChart(seriesDataList);

        const jtmc = el.jtmc;
        const nsrmc = el.nsrmc;
        const VALUE = el.bndsr;
        let html = `<h5>纳税人名称：${nsrmc}</h5>
        <h5>所属集团名称：${jtmc}</h5>
        <h5>本年度纳税额：${VALUE}万元</h5>`;
        this.popup.setLngLat([Number(el.lng), Number(el.lat)])
          .setHTML(html)
          .addTo(this.map);

        this.fly2target([Number(el.lng), Number(el.lat)], null, 18)

      } else {
      }
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

          type: 'gauge',
          min: 0,
          max: 260,
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
              fontSize: 18
            },
            formatter: '本年度收入：{value}亿'
          },
          data: [{ value: (this.curStatistics.curBNDSR / 10000).toFixed(2), name: '企业户数' }]
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

          type: 'gauge',
          min: 0,
          max: 260,
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
              fontSize: 18
            },
            formatter: '上年同期收入：{value}亿'
          },
          data: [{ value: (this.curStatistics.curSNTQ / 10000).toFixed(2), name: '上年同期收入' }]
        },

      ]
    };

  }
  /* [6]
  ** （1）添加高亮点
  ** （2）
  */
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
      this.taxDataVSrv.title = '集团企业';
    });
  }
  returnHome() {
    this.initData();
    setTimeout(() => {
      this.fly2target();
    });
  }
}
