import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import * as mapboxgl from "mapbox-gl";
import { dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel } from '@shared';
import { G2BarData } from '@delon/chart/bar';
import { forkJoin } from 'rxjs';
import { LoadingService, OnboardingService } from '@delon/abc';
import { CacheService } from '@delon/cache';
import { deepCopy } from '@delon/util';

interface itemInfo {
  jdxzmc?: string;
  bndsr?: number;
  sntq?: number;
  tbzjz?: number;
  tbzjf?: string
}

const jdxzmcs = [
  '城阳街道办事处',
  '棘洪滩街道办事处',
  '流亭街道办事处',
  '夏庄街道办事处',
  '惜福镇街道办事处',
  '上马街道办事处',
  '红岛街道办事处',
  '河套街道办事处',
  '青岛高新技术产业开发区'
]

@Component({
  templateUrl: './tax-hy-map.component.html',
  styleUrls: ['./tax-hy-map.component.less']

})
export class EconomicAnalysisMapTaxHyMapComponent implements OnInit, AfterViewInit {

  url = `analysis/town`;
  style = dark;
  townData: itemInfo[];
  noTownTaxData: itemInfo[];
  map: mapboxgl.Map;

  // 行业名称tree-select
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  hymcNodes;
  selectedHymc: string;

  @ViewChild('st') st: STComponent;
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
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'bndsr'
    },
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'sntq'
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

  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private cacheSrv: CacheService,
    private boardingSrv: OnboardingService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });
  }

  ngAfterViewInit() {
    this.loadSrv.open({ text: '正在处理……' });
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
          title: '行业选择',
          content: '选择门类或行业大类'
        },
        {
          selectors: '.board-3',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        },
        {
          selectors: '.board-4',
          title: '查询',
          content: '点击查询结果'
        },
        {
          selectors: '.board-5',
          title: '导出',
          content: '导出查询结果'
        }
      ]
    });
  }
  /**
   * 获取区域聚合数据
   */
  getData() {
    this.loadSrv.open({
      text: '正在处理……'
    });
    const $townJson = this.http.get('assets/data/CY_TOWN.json');
    const $townTaxData = this.http.get(this.url, this.getCondition());
    forkJoin([$townJson, $townTaxData])
      .subscribe(resp => {
        this.loadSrv.close();
        // 1、获取镇街税收数据,处理成包含8个街道的
        const townTaxData: itemInfo[] = resp[1].data;

        this.townData = townTaxData.filter(i => jdxzmcs.includes(i.jdxzmc));
        this.noTownTaxData = townTaxData.filter(i => !jdxzmcs.includes(i.jdxzmc));
        let noTownBndsr = 0;
        let noTownSntq = 0;
        this.noTownTaxData.forEach(i => {
          noTownBndsr += i.bndsr;
          noTownSntq += i.sntq;
        });
        const tbzjz = Math.floor((noTownBndsr - noTownSntq) * 100) / 100;
        const tbzjf = `${Math.floor(tbzjz / noTownSntq * 10000) / 100}%`;

        this.townData.push({
          jdxzmc: '其他',
          bndsr: noTownBndsr,
          sntq: noTownSntq,
          tbzjz,
          tbzjf
        });

        // 若当前数据为空，则清空上次查询结果
        if (!this.townData.length) {
          this.msgSrv.warning('当前条件下无收入数据！');

          // 判断是否存在高亮区域块数据源及图层
          if (this.map.getLayer('grid-active')) {
            this.map.removeLayer('grid-active');
          }
          if (this.map.getSource('grid-active')) {
            this.map.removeSource('grid-active')
          }

          // 判断是否存在镇街税收图层
          if (this.map.getLayer('town-layer')) {
            this.map.removeLayer('town-layer');
          }
          if (this.map.getSource('town-geo')) {
            this.map.removeSource('town-geo')
          }

          return;
        }
        // 2、获取Geometry
        const fc = resp[0];
        const taxArray = [];
        const taxFeatures = [];
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
            taxFeatures.push(deepCopy(f));
          }
        });
        const mintax = Math.min(...taxArray);
        const maxtax = Math.max(...taxArray);
        const colorRange = getColorRange(mintax, maxtax);

        const ds = {
          type: 'FeatureCollection',
          features: taxFeatures
        };

        if (this.map.getSource('town-geo')) {
          (this.map.getSource('town-geo') as mapboxgl.GeoJSONSource).setData(ds as any);
        } else {
          this.map.addSource('town-geo', {
            type: 'geojson',
            data: ds as any
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
    setTimeout(() => {
      this.getData();
      this.fly2target();
    });

    (window as any).map = e;

  }

  fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: center ? center : [120.33246, 36.276589],
      zoom: zoom ? zoom : 9.688,
      bearing: bearing ? bearing : 0,
      pitch: pitch ? pitch : 46.5,
      speed: 0.8
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
