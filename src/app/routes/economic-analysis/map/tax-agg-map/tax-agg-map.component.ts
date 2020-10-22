import { Component, OnInit, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';

import { NzMessageService } from 'ng-zorro-antd/message';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel, ColorTypes } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService, ReuseComponentInstance } from '@delon/abc';

@Component({
  selector: 'app-economic-analysis-map-tax-agg-map',
  templateUrl: './tax-agg-map.component.html',
  styleUrls: ['./tax-agg-map.component.less']

})
export class EconomicAnalysisMapTaxAggMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService) { }
  ;

  url = `analysis/town`;
  style = dark;
  townData: any[];
  townG2BarData: G2BarData[];
  barHeight;
  map: mapboxgl.Map;
  @ViewChild('st') st: STComponent;
  @ViewChild('colHost') colHost: ElementRef;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

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
      title: '镇街',
      index: 'jdxzmc',
      className: 'text-center'
    },
    {
      title: '本年度收入',
      index: 'bndsr',
      className: 'text-center'
    },
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center'
    },
    {
      title: '同比增减',
      className: 'text-center',
      render: 'tbzjz-tpl'
    }
    // {
    //   title: '',
    //   buttons: [
    //   ]
    // }
  ];

  colorStops =
    [
      "rgb(1, 152, 189)",
      "rgb(73, 227, 206)",
      "rgb(216, 254, 181)",
      "rgb(254, 237, 177)",
      "rgb(254, 173, 84)",
      "rgb(209, 55, 78)"
    ];
  heightStop = 4000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "gold";
  _onReuseDestroy: () => void;
  destroy: () => void;


  ngOnInit() { }

  _onReuseInit() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      });
    }
  }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });

  }

  /**
   * 获取区域聚合数据
   */
  getData() {
    const $townJson = this.http.get('assets/data/CY_TOWN.json');
    const $townTaxData = this.http.get(this.url, this.getCondition());
    forkJoin([$townJson, $townTaxData])
      .subscribe(resp => {
        // 1、获取镇街税收数据
        this.townData = resp[1].data;
        this.townG2BarData = this.townData.map(item => {
          return {
            x: item.jdxzmc,
            y: item.bndsr
          }
        });
        // 2、获取Geometry
        const fc = resp[0];
        const taxArray = [];
        fc.features.forEach(f => {
          const target = this.townData.find(i => i.jdxzmc === f.properties.MC);
          if (target) {
            taxArray.push(target.bndsr);

            Object.defineProperties(f.properties, {
              'tax': {
                value: target.bndsr,
                enumerable: true,
                configurable: true
              },
              'item': {
                value: target,
                enumerable: true,
                configurable: true
              }
            });
          }
        });
        const mintax = Math.min(...taxArray);
        const maxtax = Math.max(...taxArray);
        const colorRange = getColorRange(mintax, maxtax, ColorTypes.success);
        if (this.map.getSource('town-geo')) {
          (this.map.getSource('town-geo') as mapboxgl.GeoJSONSource).setData(fc);
        } else {
          this.map.addSource('town-geo', {
            type: 'geojson',
            data: fc as any
          });
        }
        // 判断是否存在高亮区域块数据源及图层
        if (this.map.getLayer('grid-active')) {
          this.map.removeLayer('grid-active');
        }
        if (this.map.getSource('grid-active')) {
          this.map.removeSource('grid-active')
        }
        // 添加高亮数据源及图层
        this.map.addSource("grid-active", {
          type: "geojson",
          data: this.gridActive as any
        });
        this.map.addLayer({
          id: "grid-active",
          type: "fill-extrusion",
          source: "grid-active",
          paint: {
            "fill-extrusion-color": this.colorActive,
            "fill-extrusion-opacity": 0.9,
            "fill-extrusion-height-transition": {
              duration: 1500
            },
            "fill-extrusion-color-transition": {
              duration: 1500
            }
          }
        });
        if (!this.map.getLayer('town-layer')) {
          this.map.addLayer({
            id: 'town-layer',
            source: 'town-geo',
            type: 'fill-extrusion',
            paint: {
              "fill-extrusion-color": {
                property: "tax",
                stops: colorRange
              },
              "fill-extrusion-height": {
                property: "tax",
                stops: [[0, 0], [maxtax, this.heightStop]]
              }, "fill-extrusion-opacity": 0.7,
              "fill-extrusion-height-transition": {
                duration: 1500
              }
            }
          });
        }
        // mousemove
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "top"
        });
        this.map.on("mousemove", e => {
          let html = "";
          const coords = [e.lngLat.lng, e.lngLat.lat];
          // console.log(e);
          const queryPoint = this.map.queryRenderedFeatures(e.point, {
            layers: ["town-layer"]
          });
          if (queryPoint.length) {
            this.map.setPaintProperty("grid-active", "fill-extrusion-height", {
              property: "tax",
              stops: [[0, 0], [maxtax, this.heightStop]]
            });
            this.gridActive.features = [queryPoint[0]];
            (this.map.getSource("grid-active") as any).setData(this.gridActive);
            this.map.getCanvas().style.cursor = "pointer";
            if (queryPoint[0].properties.item) {
              const p = JSON.parse(queryPoint[0].properties.item);
              html = `<h5>镇街：${p.jdxzmc}</h5>
              <h5>本年度税收：${p.bndsr}&nbsp;万元</h5>
              <h5>上年同期：${p.sntq}&nbsp;万元</h5>
              <h5>同比增减幅：${p.tbzjf}</h5>`;

              popup
                .setLngLat(coords as any)
                .setHTML(html)
                .addTo(this.map);

              console.log((this.st as any).el.nativeElement.style);
            }
          } else {
            // selectNsr = "";
            (this.map.getSource("grid-active") as any).setData(this.empty);
            this.map.getCanvas().style.cursor = "";
            popup.remove();
          }
        });

      });
  }

  /**
   * 获取查询条件
   */
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
   * mapbox load
   * @param e 
   */
  mapboxLoad(e) {
    this.loadSrv.close();
    this.map = e;
    setTimeout(() => {
      this.getData();
      this.fly2target();
    });

    (window as any).map = e;

  }
  /**
   * ST change event listener
   * @param e 
   */
  stChange(e) {
    setTimeout(() => {
      this.barHeight = this.colHost.nativeElement.clientHeight - (this.st as any).el.nativeElement.clientHeight - 90;
    }, 200);
  } fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: center ? center : [120.33246, 36.276589],
      zoom: zoom ? zoom : 9.688,
      bearing: bearing ? bearing : 0,
      pitch: pitch ? pitch : 46.5,
      speed: 0.8
    });
  }

  /**
   * 导出
   */
  export() {
    const filename = `镇街税收-${new Date().toLocaleString()}.xlsx`;

    const rowData = this.townData.map(i => {
      return {
        '镇街': i.jdxzmc,
        '本年度收入(万元)': i.bndsr,
        '上年同期收入(万元)': i.sntq,
        '同比增减（万元）': i.tbzjz,
        '同比增减幅': i.tbzjf
      }
    });

    const data: ExcelData[] = [
      {
        sheetName: '镇街收入',
        rowData
      }
    ];
    export2excel(filename, data);

  }
}
