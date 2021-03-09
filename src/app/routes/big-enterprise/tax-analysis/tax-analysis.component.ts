import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { BdgSelectComponent, MonthRangeComponent, Point, getColorRange, COLORS, EOrder, ZSXM, export2excel, fly2target } from '@shared';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService, LoadingService, ReuseComponentInstance, OnboardingService } from '@delon/abc';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { environment } from '@env/environment';

/**
 * 结果数据接口
 */
interface ItemData {
  NSRMC: string,
  BNDSR: number,
  SNTQ: number,
  TBZJZ: number,
  TBZJF: string,
  lat: number,
  lng: number
}

@Component({
  selector: 'app-big-enterprise-tax-analysis',
  templateUrl: './tax-analysis.component.html',
  styleUrls: ['./tax-analysis.component.less']
})
export class BigEnterpriseTaxAnalysisComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  bndTotal = 0;
  sntqTotal = 0;
  tbzjTotal = 0;
  upCount = 0;
  downCount = 0;

  url = `big-enterprises/taxsummary`;
  data: any[];
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;
  // 表头设置
  columns: STColumn[] = [
    {
      title: '排行',
      type: 'no',
      render: 'order-tpl',
      className: 'text-center',
      width: 60,
      fixed: 'left'
    },
    {
      index: 'NSRMC',
      title: '纳税人名称',
      className: 'text-center',
      width: 258,
      fixed: 'left'
      // width: 400
    },
    {
      index: 'BNDSR',
      title: '本年度税收(万元)',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'SNTQ',
      title: '上年同期(万元)',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJZ',
      title: '同比增减(万元)',
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
      index: 'BNDPM',
      title: '本年度排名',
      className: 'text-center',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.BNDPM;
          const val2 = b.BNDPM;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },
    },
    {
      index: 'SNDPM',
      title: '上年度排名',
      className: 'text-center',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.SNDPM;
          const val2 = b.SNDPM;
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
      index: 'PMZJ',
      title: '排名升降',
      className: 'text-center',
      type: 'number',
      render: 'pmzj-tpl',
      filter: {
        multiple: false,
        menus: [
          { text: '上升', value: '上升' },
          { text: '下降', value: '下降' }
        ],
        fn: (filter, record) => {
          if (filter.value === '上升') {
            return record.PMZJ >= 0;
          } else {
            return record.PMZJ < 0;

          }
        },

      }
    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          // tooltip: '详情',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../../budget/single-query'], {
              queryParams: { nsrmc: record.NSRMC },
              relativeTo: this.route
            });
          }
        }
      ]
    }
  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }
  //#region mapboxgl 相关

  style = dark;
  zoom = environment.mapbox_pos.zoom;
  center = environment.mapbox_pos.center; map: mapboxgl.Map;
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

  //#endregion


  constructor(public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private xlsx: XlsxService,
    private loadSrv: LoadingService,
    private boardingSrv: OnboardingService) { }
  _onReuseDestroy: () => void;
  destroy: () => void;


  ngAfterViewInit(): void {
    this.loadSrv.open({ text: '正在处理……' });

    // setTimeout(() => {
    //   this.query();
    // });
  }

  ngOnInit() { }
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
  /**
   * 开启引导模式
   */
  startBoard() {
    this.boardingSrv.start({
      showTotal: true,
      mask: true,
      items: [
        {
          selectors: '.board-1',
          title: '预算级次选择',
          content: '中央级、省级、市级、区县级等，可组合进行选择'
        },
        {
          selectors: '.board-2',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        },
        {
          selectors: '.board-3',
          title: '查询',
          content: '点击查询当前大企业税收情况'
        },
        {
          selectors: '.board-4',
          title: '导出',
          content: '导出查询结果'
        }
      ]
    });
  }
  getCondition() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    return { year, startMonth, endMonth, budgetValue };

  }

  /**
  * st change event
  * @param e 
  */
  stChange(e: STChange) {
    if (e.type === 'click') {
      console.log(e.click.item);
      const { lat, lng } = e.click.item
      fly2target(this.map, [lng, lat], 17, 60)
    }
  }

  /**
   * 获取数据
   */
  getData() {

    this.bndTotal = 0;
    this.sntqTotal = 0;
    this.tbzjTotal = 0;
    this.upCount = 0;
    this.downCount = 0;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.loadSrv.close();
      this.data = resp.data;
      this.data.forEach(el => {
        this.bndTotal += el.BNDSR;
        this.sntqTotal += el.SNTQ;
        if (el.TBZJZ > 0) {
          ++this.upCount;
        } else {
          ++this.downCount;
        }
      });
      this.initDotLayer(resp.data);
    });
  }

  /**
   * 
   */
  download() {
    this.loadSrv.open({
      text: '正在处理……'
    });
    const columns = this.columns.filter(col => col.title !== '操作' && col.title !== '排行');
    const data = [columns.map(i => i.title)];

    this.data.forEach(i => {
      data.push(
        columns.map(c => i[c.index as string])
      )
    });

    this.xlsx.export({
      sheets: [
        {
          data,
          name: '大企业税收'
        }
      ],
      filename: `大企业税收统计-${new Date().toLocaleString()}.xlsx`
    }).then(e => {
      this.loadSrv.close();
    });
  }

  /**
   * 批量导出当前重点企业税收
   */
  export() {
    const { startDate, endDate } = this.monthRange;

    this.loadSrv.open({
      text: '正在处理……'
    });
    // 批量查询税收
    const nsrmcs = this.data.map(item => item.NSRMC);
    this.http.post('bdg/tools/batchQuery', {
      nsrmcs,
      ...this.getCondition()
    }).subscribe(resp => {
      // 查询结果按指定字典排序映射
      const rowData = resp.data.map(item => {
        const el = {};
        Object.keys(EOrder).forEach(key => {
          el[EOrder[key]] = item[key];
        });
        Object.keys(ZSXM).forEach(key => {
          el[ZSXM[key]] = item[key] ? item[key] : 0;
        });
        return el;
      });
      this.loadSrv.close();
      export2excel(`重点企业-${startDate.getFullYear()}年${startDate.getMonth() + 1}-${endDate.getMonth() + 1}月税收分析-${new Date().toLocaleString()}.xlsx`, [{
        sheetName: '税收导出',
        rowData
      }]);

    });
  }
  //#region mapbox map相关


  mapboxLoad(e) {
    this.map = e;
    this.getData();
    // this.addTownBoundary();
    // console.log('mapbox -loaded!');
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
        this.map.getCanvas().style.cursor = 'point';
        const { nsrmc, value } = queryPt[0].properties;
        html = `<h5>纳税人名称：${nsrmc}</h5>
        <h5>本年度纳税额：${value}万元</h5>`;
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

      const html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        const { nsrmc, value } = queryPt[0].properties;
        this.router.navigate(['../../budget/single-query'], {
          queryParams: { nsrmc },
          relativeTo: this.route
        });
      }
    });
  }

  /**
   * 添加当前镇街边界图
   */
  addTownBoundary() {
    /**
     * 添加当前市边界
     */
    const $stream1 = this.http.get('assets/data/CY_TOWN.json');
    $stream1.subscribe(resp => {
      if (!this.map.getSource('current_town_line')) {
        this.map.addSource('current_town_line', {
          type: 'geojson',
          data: resp as any
        });
      }
      if (!this.map.getLayer('current_town_line')) {
        (this.map as any).addLayer({
          "id": "current_town_line",
          "type": "line",
          "source": "current_town_line",
          "minzoom": 3,
          "maxzoom": 13,
          "layout": {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "visible"
          },
          "paint": {
            "line-width": {
              "base": 1,
              "stops": [
                [7, 2],
                [14, 2.8]
              ]
            },
            "line-color": "yellow"
          }
        });
      }
    });

  }

  /**
   * 初始化散点地图
   * @param data 
   */
  initDotLayer(data: ItemData[]) {

    const values = data.map(i => i.BNDSR);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 构造点集合
    const features = data.filter(i => i.lat && i.lng).map((i, index) => {
      return Point(i.lat, i.lng, {
        nsrmc: i.NSRMC,
        value: i.BNDSR
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
      this.initClusterLayer(fc);
      this.initHeatLayer();
    }


  }

  /**
   * 初始化散点图
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
            ['get', 'value'],
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
            6,
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

  initClusterLayer(data) {

    const that = this;
    const value1 = ['<', ['get', 'value'], 50];
    const value2 = ['all', ['>=', ['get', 'value'], 50], ['<', ['get', 'value'], 100]];
    const value3 = ['all', ['>=', ['get', 'value'], 100], ['<', ['get', 'value'], 500]];
    const value4 = ['all', ['>=', ['get', 'value'], 500], ['<', ['get', 'value'], 1000]];
    const value5 = ['>=', ['get', 'value'], 1000];

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
  // 
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

  /**
   * 图层切换
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
  //#endregion




}
