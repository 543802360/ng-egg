import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';

import { NzMessageService, NzTreeSelectComponent } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { dark_T as dark, decimal_T as decimal } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel, ColorTypes, order } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService } from '@delon/abc';
import { CacheService } from '@delon/cache';
import { deepCopy } from '@delon/util';
// mapbox pos参数
const MAPBOX_POS = {
  center: [120.8303991378192, 37.10038795930873],
  pitch: 40,
  bearing: -10.441292648171384,
  zoom: 8.056808924835703
}

// 税收分级次item接口
interface ssfjcItem {
  SE_HJ_LJ_BQ?: number,
  SE_HJ_LJ_SNTQ?: number,
  SE_HJ_LJ_BQ_ZJBL?: number,
  SE_HJ_LJ_BQ_ZJE?: number,
  SWJGJC?: string
}
@Component({
  templateUrl: './tax-hy-map.component.html',
  styleUrls: ['./tax-hy-map.component.less']

})
export class EconomicAnalysisMapTaxHyMapComponent implements OnInit, AfterViewInit {

  url = `analysis/county`;
  style = decimal;
  townData: any[];
  townG2BarData: G2BarData[];
  map: mapboxgl.Map;

  // 行业名称tree-select
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  hymcNodes;
  selectedHymc: string;

  @ViewChild('st') st: STComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  total = 0;
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
      title: '区市',
      index: 'SWJGJC',
      className: 'text-center'
    },
    {
      title: '本年度收入',
      index: 'SE_HJ_LJ_BQ',
      type: 'number',
      className: 'text-center'
    },
    {
      title: '上年同期',
      index: 'SE_HJ_LJ_SNTQ',
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

  heightStop = 20000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "gold";

  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private cacheSrv: CacheService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });
  }

  ngAfterViewInit() {
    // this.loadSrv.open({ text: '正在处理……' });
  }

  /**
   * 获取区域聚合数据
   */
  getData() {
    const $stream2 = this.http.get('assets/data/yt/SWJG.json');
    const $stream1 = this.http.get(this.url, this.getCondition());
    // 3、构造专题数据
    forkJoin([$stream1, $stream2])
      .subscribe(resp => {
        // 税款国库geo数据
        const skgkResp = resp[1];
        // 税收分级次数据
        const ssfjcData: ssfjcItem[] = resp[0].data;
        // 4、获取烟台市统计数据
        // this.totalItem = ssfjcData.find(i => i.SWJG_MC === '烟台市');
        // this.cacheSrv.set('totalTax', this.totalItem);
        // 5、合并税款数据至properties
        skgkResp.features.forEach(el => {
          const target = ssfjcData.find(i => i.SWJGJC.includes(el.properties.SWJGJC.trim()));
          Object.assign(el.properties, target);
        });
        this.ssfjcData = skgkResp.features.map(i => i.properties).sort(order('SE_HJ_LJ_BQ'));
        // 6、加载geo
        const taxValues = ssfjcData.filter(i => i.SWJGJC !== '烟台市').map(i => i['SE_HJ_LJ_BQ']);
        this.total = taxValues.reduce((x, y) => x + y);

        const taxMax = Math.max(...taxValues);
        const taxMin = Math.min(...taxValues);
        console.log(taxMin, taxMax);
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
                property: "SE_HJ_LJ_BQ",
                stops: colorStops
              },
              "fill-extrusion-height": {
                property: "SE_HJ_LJ_BQ",
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

        setTimeout(() => {
          this.fly2target();
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

    if (!this.hyTreeSelect.getSelectedNodeList().length) {
      return { year, startMonth, endMonth, budgetValue };
    }
    if (this.hyTreeSelect.getSelectedNodeList().length !== 0) {
      const selectedNode = this.hyTreeSelect.getSelectedNodeList()[0];
      return selectedNode.parentNode ? { year, startMonth, endMonth, budgetValue, hymc: selectedNode.title } :
        { year, startMonth, endMonth, budgetValue, mlmc: selectedNode.title };
    }

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
      // this.getData();
      // this.fly2target();
    });

    (window as any).map = e;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "top"
    });
    // mousemove event;
    this.map.on("mousemove", e => {
      let html = "";
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: ["ssfjc-extrusion-layer"]
      });
      if (queryPoint.length) {
        const target = queryPoint[0];
        const { SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME } = target.properties;
        // setTimeout(() => {
        //   this.selectedXzqh = {
        //     SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME
        //   };

        // });

        this.gridActive.features = [target];
        (this.map.getSource("grid-active") as any).setData(this.gridActive);
        this.map.getCanvas().style.cursor = "pointer";
        html = `<h5>行政区划：${NAME}</h5>
          <h5>收入额&nbsp;&nbsp;：${(SE_HJ_LJ_BQ / 10000).toLocaleString()}亿</h5>
          <h5>同比增减：${(SE_HJ_LJ_BQ_ZJE / 10000).toLocaleString()}亿</h5>
          <h5>同比增幅：${SE_HJ_LJ_BQ_ZJBL}</h5>`;

        popup
          .setLngLat(coords as any)
          .setHTML(html)
          .addTo(this.map);

      } else {
        (this.map.getSource("grid-active") as any).setData(this.empty);
        this.map.getCanvas().style.cursor = "";
        popup.remove();
      }
    });


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

  export() {
    const filename = `镇街按行业税收-${new Date().toLocaleString()}.xlsx`;

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
        sheetName: '镇街按行业税收',
        rowData
      }
    ];
    export2excel(filename, data);

  }
}
