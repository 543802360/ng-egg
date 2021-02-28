import { deepCopy } from '@delon/util';
import { Component, OnInit, ViewChild, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage, STReq, STRequestOptions, STRes } from '@delon/abc/st';

import { NzMessageService } from 'ng-zorro-antd/message';
import * as mapboxgl from "mapbox-gl";
import { blue as dark } from "@geo";
import { BdgSelectComponent, MonthRangeComponent, getColorRange, ExcelData, export2excel, ColorTypes } from '@shared';
import { forkJoin } from 'rxjs';
import { LoadingService, OnboardingService, ReuseComponentInstance, STChange } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "@env/environment";
interface itemInfo {
  jdxzmc?: string;
  nsrmc?: string;
  bndsr?: number;
  sntq?: number;
  tbzjz?: number;
  tbzjf?: string
}
@Component({
  selector: 'app-economic-analysis-map-tax-agg-map',
  templateUrl: './tax-agg-map.component.html',
  styleUrls: ['./tax-agg-map.component.less']

})
export class EconomicAnalysisMapTaxAggMapComponent implements OnInit, AfterViewInit, ReuseComponentInstance {


  townTaxUrl = `analysis/townAggTax`;
  style = dark;
  // 有镇街所属的数据
  townData: itemInfo[];

  // 街道纳税人税收明细列表
  townStVisible = false;
  // 总量
  total = 0;
  // 当前所选街道
  selectedJdxz: string;

  downfileName = '';
  downfileParams;

  //#region 展开表
  page: STPage = {
    total: true,
    showSize: true,
    pageSizes: [10, 20, 30, 40, 50, 100]
  };
  // 请求配置
  companyReq: STReq = {
    type: 'page',
    method: 'GET',
    reName: {
      pi: 'pageNum',
      ps: 'pageSize'
    },
    process: (requestOpt: STRequestOptions) => {
      const { jdxzmc } = requestOpt.params as any;
      const params = this.getCondition();
      requestOpt.params = { ...deepCopy(requestOpt.params), ...params, jdxzmc: this.selectedJdxz } as any;
      return requestOpt;
    }
  };
  // response 配置
  companyRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      console.log('rawData:', rawData);
      this.total = rawData.count;
      return rawData.data;
    }
  };
  //#endregion

  map: mapboxgl.Map;
  @ViewChild('st') st: STComponent;
  // expandSt
  @ViewChild('jdxzSt') jdxzSt: STComponent;

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
      className: 'text-center',
      width: 180

    },
    {
      title: '本年度收入',
      index: 'bndsr',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'bndsr',
      width: 100
    },
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'sntq',
      width: 100
    },
    {
      title: '同比增减',
      className: 'text-center',
      render: 'tbzjz-tpl',
      width: 190
    },
    // {
    //   title: '操作',
    //   className: 'text-center',
    //   width: 55,
    //   fixed: 'right',
    //   buttons: [
    //     {
    //       tooltip: '查看本街道企业信息',
    //       icon: 'info',
    //       // 点击查询
    //       click: (record: STData, modal: true) => {
    //         // console.log('record:', record);
    //       }
    //     }
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


  constructor(
    private boardingSrv: OnboardingService,
    public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService) { }


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
        }
        ,
        {
          selectors: '.board-2',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        }
        ,
        {
          selectors: '.board-3',
          title: '查询',
          content: '点击查询结果'
        },
        {
          selectors: '.board-4',
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
    })
    const $townJson = this.http.get('assets/data/town.json');
    const $townTaxData = this.http.get(this.townTaxUrl, this.getCondition());
    forkJoin([$townJson, $townTaxData])
      .subscribe(resp => {
        this.loadSrv.close();
        // 1、获取镇街税收数据,处理成包含8个街道的
        const townTaxData: itemInfo[] = resp[1].data;

        this.townData = [...townTaxData.filter(i => i.jdxzmc != '黄岛区')];
        // 2、获取Geometry
        const fc = resp[0];
        const taxArray = [];
        fc.features.forEach(f => {
          const target = this.townData.find(i => i.jdxzmc === f.properties.name);
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
        const colorRange = getColorRange(mintax, maxtax, ColorTypes.danger);
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
    // return { year, startMonth, endMonth, budgetValue };
    return { year: 2019, startMonth: 1, endMonth: 2, budgetValue };


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
  stChange(e: STChange) {

    if (e.type === 'click') {
      const { jdxzmc } = e.click.item;
      this.selectedJdxz = jdxzmc;

      this.downfileParams = { ...this.getCondition(), jdxzmc: this.selectedJdxz };
      const { startDate, endDate } = this.monthRange;
      const year = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;
      this.downfileName = `${jdxzmc}-${year}年${startMonth}-${endMonth}月税收统计.xlsx`;
      setTimeout(() => {
        this.townStVisible = true;
      }, 123);
      if (this.townStVisible) {
        this.jdxzSt.load(1);
      }
    }

  }

  /**
   * ST change event listener
   * @param e 
   */
  jdxzStChange(e: STChange) {

    if (e.type === 'click') {
      console.log('qy item', e.click.item);
      this.router.navigate(['../../budget/single-query'], {
        queryParams: {
          nsrmc: e.click.item.nsrmc
        }
      })
    }

  }
  /**
   * 飞行至指定点
   * @param center 
   * @param pitch 
   * @param zoom 
   * @param bearing 
   */
  fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: center ? center : environment.mapbox_pos.center,
      zoom: zoom ? zoom : environment.mapbox_pos.zoom,
      bearing: bearing ? bearing : 0,
      pitch: pitch ? pitch : 46.5,
      speed: 0.8
    });
  }

  /**
   * 导出镇街收入列表
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

  downPre(e) {
    console.log(e);
  }

  exportTownNsrTaxList() {
    this.http.get('analysis/exportTownTaxList', { ...this.getCondition(), jdxzmc: this.selectedJdxz }).subscribe(resp => { });
  }
}
