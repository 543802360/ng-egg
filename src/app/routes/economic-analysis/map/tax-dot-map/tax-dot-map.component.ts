import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription, from, timer } from 'rxjs';
import { NzMessageService, NzTreeSelectComponent } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, Point, getColorRange, COLORS } from '@shared';
import { LoadingService, ReuseTabService, ReuseHookTypes, ReuseComponentInstance } from '@delon/abc';
import { Router, ActivatedRoute } from '@angular/router';

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
  selector: 'app-economic-analysis-map-tax-dot-map',
  templateUrl: './tax-dot-map.component.html',
  styleUrls: ['./tax-dot-map.component.less'],
})
export class EconomicAnalysisMapTaxDotMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  url = `analysis/taxdot`;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  ds: MyDataSource;// 查询结果数据源 
  selectedValue = 50; // 所选纳税金额
  selectedHy; // 所选行业
  resData: ItemData[];
  //#region mapboxgl 相关

  style = dark;
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

  //#endregion


  constructor(
    public http: _HttpClient,
    private loadSrv: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private msgSrv: NzMessageService) { }
  _onReuseDestroy: () => void;
  destroy: () => void;

  ngOnInit() { }

  /**
   * 复用路由初始化，重复进入时
   */
  _onReuseInit() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
        if (this.ds) {
          this.ds.updateSource(this.resData);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });
  }

  /**
   * 单击查看明细
   * @param i 
   */
  click(i: ItemData) {
    this.router.navigate(['../../budget/single-query'], {
      queryParams: { nsrmc: i.NSRMC },
      relativeTo: this.route
    })
  }
  /**
   * 行业选择事件
   * @param e 
   */
  hyChange(e) {
    this.selectedHy = e;
  }

  /**
   * 查询数据
   */
  getData() {
    this.loadSrv.open({ text: '正在处理……' });
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.resData = resp.data;
      if (this.ds) {
        this.ds.updateSource(resp.data);
      } else {
        this.ds = new MyDataSource(resp.data);
      }
      this.loadSrv.close();
      this.initDotLayer(resp.data);
      this.initHeatLayer(resp.data);

    });
  }

  /**
   * 获取查询条件参数
   */
  getCondition() {
    this.bdgSelect.budgetValue.length == 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    const value = this.selectedValue;

    // const adminCode = '3302130000';
    return this.selectedHy === null ? { year, startMonth, endMonth, budgetValue, value }
      : { year, startMonth, endMonth, budgetValue, value, ...this.selectedHy };

  }

  /**
   * 初始化散点地图
   * @param data 
   */
  initDotLayer(data: ItemData[]) {

    const values = data.map(i => i.BNDSR);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const colorStops = getColorRange(min, max, 'danger');
    console.log(colorStops);
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
    this.initClusterLayer(fc);
    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as mapboxgl.GeoJSONSource).setData(fc as any);
      return;
    }
    else {
      this.map.addSource('dot-source', {
        type: 'geojson',
        data: fc as any
      });
    }

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
    })

  }

  /**
   * 初始化散点图
   * @param data 
   */
  initHeatLayer(data: ItemData[]) {
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
      'clusterRadius': 80,
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
        'text-size': 10,
        visibility: 'none'
      },
      'paint': {
        'text-color': [
          'case',
          ['<', ['get', 'value'], 100],
          'black',
          'white'
        ]
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
  switchLayer(e) {
    switch (e) {
      case 'heat':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'visible');
        this.map.setLayerZoomRange('dot-layer', 12.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        this.map.fire('move');
        break;
      case 'dot':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        this.map.fire('move');

        break;

      case 'cluster':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'visible');
        this.map.fire('move');

        break;

      default:
        break;
    }
  }

  export() {

  }

  mapboxLoad(e) {
    this.map = e;
    setTimeout(() => {
      this.getData();
    });
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
        layers: ['dot-layer']
      });
      if (queryPt.length) {
        this.pointActive.features = [queryPt[0]];
        (this.map.getSource('point-active') as any).setData(this.pointActive);
        console.log(this.pointActive);
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
    })
  }

}

class MyDataSource extends DataSource<ItemData>{

  private pageSize = 5;
  private cachedData: ItemData[];
  private fetchedPages = new Set<number>();
  private dataStream;
  private subscription = new Subscription();
  private data: ItemData[];
  constructor(data: ItemData[]) {
    super();
    this.data = data;
    this.cachedData = Array.from<ItemData>({ length: this.data.length });
    this.dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
    this.fetchedPages.clear();

  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  updateSource(data?: ItemData[]) {
    this.cachedData = Array.from<ItemData>({ length: data.length });
    this.fetchedPages.clear();
    setTimeout(() => {
      this.fetchPage(0);
    }, 100);
  }
  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    // from([]).pipe(debounce(() => timer(400))).subscribe(resp => {

    // });
    const appendData = this.data.slice(page * this.pageSize, (page + 1) * this.pageSize)
    this.cachedData.splice(page * this.pageSize, this.pageSize, ...appendData);
    this.dataStream.next(this.cachedData);
  }

}