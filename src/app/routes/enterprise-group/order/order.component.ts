import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { BdgSelectComponent, MonthRangeComponent, order, COLORS, Point } from '@shared';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService, LoadingService, ReuseComponentInstance } from '@delon/abc';
import * as mapboxgl from "mapbox-gl";
import { dark_T as dark, decimal_T as decimal } from '@geo';
import { forkJoin } from 'rxjs';

interface jtpmInfo {
  GNAME?: string,
  NSRMC?: string,
  BNDSR,
  SNTQ,
  TBZJZ,
  TBZJF,
  SWJGJC?: string,
  LNG?: number,
  LAT?: any
}
const MAPBOX_POS = {
  center: [120.8303991378192, 37.10038795930873],
  pitch: 60,
  bearing: -10.441292648171384,
  zoom: 8.056808924835703
}
@Component({
  selector: 'app-enterprise-group-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class EnterpriseGroupOrderComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  bndTotal = 0;
  sntqTotal = 0;
  tbzjTotal = 0;
  upCount = 0;
  downCount = 0;

  // jtpmUrl = `jtqy/jtpm`;
  jtfbUrl = `http://140.68.16.96:10080/ytswht/api/jtqy/jtpmzb?_allow_anonymous=true`;

  jtpmUrl = 'http://140.68.16.96:10080/ytswht/api/jtqy/jtpm?_allow_anonymous=true';
  jtpmData: jtpmInfo[];

  jtfbData: jtpmInfo[];

  expandStData: jtpmInfo[];

  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;
  @ViewChild('expandSt') expandSt: STComponent;

  // 表头设置
  columns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      fixed: 'left',
      render: 'order-tpl',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.st.pi - 1) * this.st.ps + index + 1}`;

      }

    },
    {
      index: 'GNAME',
      title: '集团名称',
      className: 'text-center',
      fixed: 'left',
      // width: 400
    },
    {
      index: 'BNDSR',
      title: '本年度税收',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl',
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl',
    },

    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          tooltip: '详情',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.filterLayer(record.GNAME);
            // this.router.navigate(['../../budget/single-query'], {
            //   queryParams: { nsrmc: record.NSRMC },
            //   relativeTo: this.route
            // });
          }
        }
      ]
    }
  ]

  expandColumns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      fixed: 'left',
      render: 'order-tpl',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.expandSt.pi - 1) * this.expandSt.ps + index + 1}`;

      }

    },
    {
      index: 'NSRMC',
      title: '企业名称',
      className: 'text-center',
      fixed: 'left',
      // width: 400
    },
    {
      index: 'BNDSR',
      title: '本年度税收',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl',
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl',
    },

  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }


  style = decimal;
  map: mapboxgl.Map;
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
  })

  constructor(public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private xlsx: XlsxService,
    private loadSrv: LoadingService,
    private modal: ModalHelper) { }

  _onReuseDestroy: () => void;
  destroy: () => void;
  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.getData();
    // });
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
  ngOnInit() { }


  getCondition() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    return { year, startMonth, endMonth, budgetValue };

  }

  getData() {

    this.bndTotal = 0;
    this.sntqTotal = 0;
    this.tbzjTotal = 0;
    this.upCount = 0;
    this.downCount = 0;

    const $jtpm = this.http.get(this.jtpmUrl, this.getCondition());
    const $jtfb = this.http.get(this.jtfbUrl, this.getCondition());

    forkJoin([$jtpm, $jtfb]).subscribe(resp => {
      this.jtpmData = resp[0].data.sort(order('BNDSR'));
      this.jtfbData = resp[1].data.sort(order('BNDSR'));
      // 计算合计数字
      this.jtpmData.forEach(el => {
        this.bndTotal += el.BNDSR;
        this.sntqTotal += el.SNTQ;
        if (el.TBZJZ > 0) {
          ++this.upCount;
        } else {
          ++this.downCount;
        }
      });
      // 
      this.initDotLayer(resp[1].data);

    });
  }

  download() {
    this.loadSrv.open({
      text: '正在处理……'
    });
    const columns = this.columns.filter(col => col.title !== '操作');
    const data = [columns.map(i => i.title)];

    this.jtpmData.forEach(i => {
      data.push(
        columns.map(c => i[c.index as string])
      )
    });

    this.xlsx.export({
      sheets: [
        {
          data,
          name: '集团税收'
        }
      ],
      filename: `集团税收统计-${new Date().toLocaleString()}.xlsx`
    }).then(e => {
      this.loadSrv.close();
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
        const { GNAME } = e.expand;
        this.expandStData = this.jtfbData.filter(i => i.GNAME === GNAME);
        break;
      case "click":
        setTimeout(() => {
          this.fly2target([e.click.item.LNG, e.click.item.LAT], null, 17, null);
        });
        break;
      default:
        break;
    }

  }
  /**
   * fly to target
   * @param center 
   * @param pitch 
   * @param zoom 
   * @param bearing 
   */
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
   * mapbox map loaded event
   * @param e 
   */
  mapboxLoad(e) {
    this.map = e;
    (window as any).map = this.map;
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
    });
    this.getData();
    // 添加高亮数据源
    this.map.addSource('point-active', {
      type: 'geojson',
      data: this.pointActive as any
    });
    this.map.addLayer({
      id: 'point-active',
      type: 'circle',
      source: 'point-active',
      layout: {
        visibility: 'visible'
      },
      paint: {
        "circle-radius": 30,
        // "circle-radius": {
        //   stops: [[9, 4], [19, 22]]
        // },
        "circle-color": '#ffc300',
        "circle-opacity": 0.8,
        "circle-blur": 0.8
      }

    });
    // 注册鼠标移动事件
    this.map.on('mousemove', e => {
      let html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        this.pointActive.features = [queryPt[0]];
        (this.map.getSource('point-active') as any).setData(this.pointActive);
        console.log(this.pointActive);
        this.map.getCanvas().style.cursor = 'point';
        const { NSRMC, VALUE } = queryPt[0].properties;
        html = `<h5>纳税人名称：${NSRMC}</h5>
        <h5>本年度纳税额：${VALUE}万元</h5>`;
        this.popup.setLngLat([lng, lat]).setHTML(html).addTo(this.map);
      } else {
        (this.map.getSource('point-active') as any).setData(this.empty);
        this.map.getCanvas().style.cursor = '';
        this.popup.remove();
      }
    });
    this.map.on('mouseleave', e => {
      this.popup.remove();
    });
    this.map.on('click', e => {
      console.log(e);
      const html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        const { NSRMC, VALUE } = queryPt[0].properties;
        this.router.navigate(['../../budget/single-query'], {
          queryParams: { NSRMC },
          relativeTo: this.route
        });
      }
    });
  }

  //#region 初始化三种样式专题图

  /**
 * 初始化散点地图
 * @param data 
 */
  initDotLayer(data: jtpmInfo[]) {

    const values = data.map(i => i.BNDSR);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 构造点集合
    const features = data.filter(i => i.LAT != "").map((i, index) => {
      return Point(i.LAT, i.LNG, {
        GNAME: i.GNAME,
        NSRMC: i.NSRMC,
        VALUE: i.BNDSR
      })
    });

    const fc = {
      type: 'FeatureCollection',
      features
    };


    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as mapboxgl.GeoJSONSource).setData(fc as any);
      (this.map.getSource('nsr') as mapboxgl.GeoJSONSource).setData(fc as any);

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
            stops: [[9, 5], [19, 20]]
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
      this.initClusterLayer(fc);
      this.initHeatLayer();
    }


  }

  /**
   * 初始化热力图
   * @param data 
   */
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
  // code for creating an SVG donut chart from feature properties
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

  //#endregion

  /**
   * 切换散点、聚合、热力等图层
   * @param e 
   */
  switchLayer(e) {
    switch (e) {
      case 'heat':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'visible');
        this.map.setLayerZoomRange('dot-layer', 12.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
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

  filterLayer(gname: string) {

    this.map.setFilter('')
    this.map.setFilter('heat-layer', ['==', ['get', 'GNAME'], gname]);
    this.map.setFilter('dot-layer', ['==', ['get', 'GNAME'], gname]);
    this.map.setFilter('dot-layer', ['==', ['get', 'GNAME'], gname]);
    this.map.setFilter('nsr_circle', ['==', ['get', 'GNAME'], gname]);
    this.map.setFilter('nsr_label', ['==', ['get', 'GNAME'], gname]);
  }

}
