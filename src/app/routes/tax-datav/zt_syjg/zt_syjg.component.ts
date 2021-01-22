import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { DEFAULT_SWJG_DM, MAPBOX_POS, IHyItem, ISyjgItem, SYJG, MLMC, DJZCLX } from "../tax-datav-dics";
import { NzButtonComponent } from 'ng-zorro-antd/button/public-api';



@Component({
  templateUrl: './zt_syjg.component.html',
  styleUrls: ['./zt_syjg.component.scss']
})
export class TaxDatavZtSyjgComponent implements OnInit, AfterViewInit {

  @ViewChild('ybnsr') ybnsrBtn: NzButtonComponent;
  syjgList = [];
  ybnsrNum = 0;
  ybnsrTax = 0;
  xgmnsrNum = 0;
  xgmnsrTax = 0;
  dwnsrNum = 0;
  dwnsrTax = 0;
  gtnsrNum = 0;
  gtnsrTax = 0;
  leftTopChartOpt1;
  leftTopChartOpt2;
  leftTopChartOpt3;
  leftTopChartOpt4;
  leftTopChartOpt5;
  leftTopChartOpt6;
  leftTopChartOpt7;
  leftTopChartOpt8;

  ybnsrXgmCountChartOpt;
  ybnsrXgmTaxChartOpt;
  dwGtCountChartOpt;
  dwGtTaxChartOpt;

  syjgUrl = 'datacenter/syjgsummary';// 税源结构分析
  sssrfqylxUrl = 'datacenter/sssrfqylx'; //税收收入分企业类型
  sssrfhyUrl = 'datacenter/sssrfcyhy'; //税收收入分行业数据

  hyhsSummaryUrl = 'datacenter/hyhsSummary'; //行业户数概览（全市）
  hyhsBySwjgdmUrl = 'datacenter/hyhsBySwjgdm'; //行业户数按税务机关统计
  djzclxHsSummaryUrl = 'datacenter/djzclxhsSummary'; //分企业类型统计分析
  djzclxHsBySwjgUrl = 'datacenter/djzclxhsBySwjgdm'; //分企业类型按税务机关统计分析
  qnndGlhsUrl = 'datacenter/syjgTotal'; //去年年底管理户数

  selectedSyjg = 'ybnsr'; //当前所选类别
  selectedSyjgButton; //当前所选类别



  selectedSwjgJC;
  syjgData: ISyjgItem[]; //税源结构数据
  swjgGeojson; //税务机关geojson


  countyVisible = false;
  cityCurrentGlhsl; //市级当前年度管理户数量
  cityPrevGlhsl; //市级上年度管理户数量

  countyCurrentGlhsl; //当前市管理户数量
  countyPrevGlhsl; //区县管理户数量

  hyssChartOpt;
  hyssChart;
  qylxChartOpt;
  qylxChart;


  style = decimal;
  map: mapboxgl.Map;// map 
  heightStop = 40000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "yellow";
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'top'
  });

  constructor(public http: _HttpClient,
    private loadSrv: LoadingService,
    private cacheSrv: CacheService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public taxDataVSrv: TaxDataVService) {

  }

  mapboxLoad(e) {
    this.loadSrv.open({ text: '正在处理……' });

    this.map = e;
    this.fly2target();
    // this.addCityBoundary();
    // this.addDistrictBoundary();
    this.mapboxMapEvent();
    this.initSyjgData();

    this.initFhyData();
    this.initFqylxData();
    this.initSyjgfx();
  }

  mapboxMapEvent() {
    this.map.on('mousemove', e => {
      let html = "";
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: ["syjg-extrusion-layer"]
      });
      if (queryPoint.length) {
        const target = queryPoint[0];
        const { FLSL, GLHSL, BL, SSGX, SWJGJC, ZGSWJ_DM } = target.properties;

        this.gridActive.features = [target];
        (this.map.getSource("grid-active") as any).setData(this.gridActive);
        this.map.getCanvas().style.cursor = "pointer";
        html = `<h5>行政区划：${SWJGJC}</h5>
          <h5>${SYJG[this.selectedSyjg]}户数：${FLSL}户</h5>
          <h5>总管理户数：${GLHSL}户</h5>
          <h5>占比：${BL}%</h5>
          <h5>税收：${(Math.round(SSGX / 10000)).toLocaleString()} 万元</h5>`;

        this.popup
          .setLngLat(coords as any)
          .setHTML(html)
          .addTo(this.map);


      } else {
        (this.map.getSource("grid-active") as any).setData(this.empty);
        this.map.getCanvas().style.cursor = "";
        this.popup.remove();
      }
    });
    this.map.on('mouseleave', e => {
      this.popup.remove();
    });
    this.map.on('click', e => {
      this.countyVisible = true;
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: ["syjg-extrusion-layer"]
      });
      if (queryPoint.length) {
        const target = queryPoint[0];

        const { ZGSWJ_DM, SWJGJC, NAME } = target.properties;
        this.selectedSwjgJC = NAME;
        this.initFhyData(ZGSWJ_DM);
        this.initFqylxData(ZGSWJ_DM);
        this.initSyjgfx(ZGSWJ_DM);


      }

    });

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

  /* [2.5] 统计（通过一级数据的处理，获取二级数据）
  */
  /* [3]
  ** （1）添加城市边界
  ** （2）添加区县边界
  ** （3）添加文字标记
  ** （4）给某个点添加高亮
  */

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.taxDataVSrv.title = '税源结构分布图';
    });

  }

  /**
  * 初始化税源结构数据
  */
  initSyjgData() {

    // 判断是否存在行政区划数据数据源及图层
    if (this.map.getLayer('syjg-extrusion-layer')) {
      this.map.removeLayer('syjg-extrusion-layer');
    }
    if (this.map.getSource('syjg-source')) {
      this.map.removeSource('syjg-source')
    }
    // 判断是否存在高亮区域块数据源及图层
    if (this.map.getLayer('grid-active')) {
      this.map.removeLayer('grid-active');
    }
    if (this.map.getSource('grid-active')) {
      this.map.removeSource('grid-active')
    }

    // 1、获取税源结构数据
    const $stream1 = this.http.get(this.syjgUrl);
    // 2、税务机关对应geojson
    const $stream2 = this.http.get('assets/data/yt/SWJG.json');
    // 3、构造专题数据
    forkJoin([$stream1, $stream2])
      .subscribe(resp => {
        // 税务机关geo数据
        this.swjgGeojson = resp[1];
        this.syjgData = resp[0].data;
        console.log("this.syjgDat:", this.syjgData);
        // 按类别提取税源结构数据
        const targetSwjgData: ISyjgItem[] = this.syjgData.filter(i => i.LB === this.selectedSyjg);
        // 
        this.swjgGeojson.features.forEach(el => {
          const target = targetSwjgData.find(i => i.SWJGJC === el.properties.SWJGJC);
          Object.assign(el.properties, target);
        });
        // // 6、加载geo
        const values = targetSwjgData.map(i => i['FLSL']);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        // console.log(taxMin, taxMax);
        const colorStops = getColorRange(minValue, maxValue, ColorTypes.baronRedBlue);
        if (!this.map.getSource('syjg-source')) {
          this.map.addSource('syjg-source', {
            'type': 'geojson',
            'data': this.swjgGeojson as any
          });
        }
        if (!this.map.getLayer('syjg-extrusion-layer')) {
          this.map.addLayer({
            'id': 'syjg-extrusion-layer',
            'type': 'fill-extrusion',
            'source': "syjg-source",
            'paint': {
              // "fill-extrusion-color": "hsl(55, 1%, 17%)",
              "fill-extrusion-color": {
                property: 'FLSL',
                stops: colorStops
              },
              "fill-extrusion-height": {
                property: 'FLSL',
                stops: [[minValue, 0], [maxValue, this.heightStop]]
              },
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 0.6,
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
                property: 'FLSL',
                stops: [[minValue, 0], [maxValue, this.heightStop]]
              },
              "fill-extrusion-opacity": 0.4,
              "fill-extrusion-height-transition": {
                duration: 1500
              },
              "fill-extrusion-color-transition": {
                duration: 1500
              }
            }
          });
        }

        this.switchLayer(this.selectedSyjg, this.ybnsrBtn);

      });


  }


  /**
   * 初始化税源结构分析数据
   * @param swjg_dm 
   */
  initSyjgfx(swjg_dm?: string) {

    console.log("swjg_dm:", swjg_dm);
    this.http.get('datacenter/syjg', {
      swjg_dm
    }).subscribe(resp => {
      this.syjgList = resp.data;

      const [ybnsrItem, xgmItem, zchItem, fzchItem, dwnsrItem, gtItem] = resp.data;
      console.log("syjgList:", resp.data);
      if (swjg_dm) {
        this.countyVisible = true;
        this.countyCurrentGlhsl = this.syjgList[0]['GLHSL'];
      } else {
        this.cityCurrentGlhsl = this.syjgList[0]['GLHSL'];
      }

      this.ybnsrNum = this.syjgList.find(i => i.LB == "ybnsr").FLSL;
      this.ybnsrTax = this.syjgList.find(i => i.LB == "ybnsr").SSGX;
      this.xgmnsrNum = this.syjgList.find(i => i.LB == "xgm").FLSL;
      this.xgmnsrTax = this.syjgList.find(i => i.LB == "xgm").SSGX;
      this.dwnsrNum = this.syjgList.find(i => i.LB == "dwnsr").FLSL;
      this.dwnsrTax = this.syjgList.find(i => i.LB == "dwnsr").SSGX;
      this.gtnsrNum = this.syjgList.find(i => i.LB == "gtnsr").FLSL;
      this.gtnsrTax = this.syjgList.find(i => i.LB == "gtnsr").SSGX;
      this.initYbnsrXgmChart(this.ybnsrNum, this.ybnsrTax, this.xgmnsrNum, this.xgmnsrTax);
      this.initDwGtChart(this.dwnsrNum, this.dwnsrTax, this.gtnsrNum, this.gtnsrTax);

      // this.initLeftChart(this.ybnsrNum, this.ybnsrTax, this.xgmnsrNum, this.xgmnsrTax, this.dwnsrNum, this.dwnsrTax, this.gtnsrNum, this.gtnsrTax);
    });

    this.http.get(this.qnndGlhsUrl, {
      swjg_dm
    }).subscribe(resp => {
      console.log('去年年底管理户数：', resp);
    });

  }


  /**
   * 初始化一般纳税人与小规模图表
   * @param ybnsrNum 
   * @param ybnsrTax 
   * @param xgmnsrNum 
   * @param xgmnsrTax 
   */
  initYbnsrXgmChart(ybnsrNum, ybnsrTax, xgmnsrNum, xgmnsrTax) {
    // 
    this.ybnsrXgmCountChartOpt = {
      title: {
        text: '户数'
      },
      color: ['#006cff', '#16fcff'],
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}:{c}({d}%)'
      },
      toolbox: {
        show: false,
        feature: {
          magicType: {
            type: ['pie', 'funnel']
          },
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '户数',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {
              value: ybnsrNum,
              name: '一般纳税人'
            },
            {
              value: xgmnsrNum,
              name: '小规模'
            }
          ]


        }
      ]
    };

    this.ybnsrXgmTaxChartOpt = {
      title: {
        text: '税收（万元）'
      },
      color: ['#006cff', '#16fcff'],
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}:{c}({d}%)'
      },
      toolbox: {
        show: false,
        feature: {
          magicType: {
            type: ['pie', 'funnel']
          },
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '税收（万元）',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {
              value: Math.round(ybnsrTax / 10000),
              name: '一般纳税人'
            },
            {
              value: Math.round(xgmnsrTax / 10000),
              name: '小规模'
            }
          ]
        }
      ]
    }

  };


  /**
   * 
   * @param dwnsrNum 
   * @param dwnsrTax 
   * @param gtnsrNum 
   * @param gtnsrTax 
   */
  initDwGtChart(dwnsrNum, dwnsrTax, gtnsrNum, gtnsrTax) {
    this.dwGtCountChartOpt = {
      title: {
        text: '户数'
      },
      color: ['#006cff', '#16fcff'],
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}:{c}({d}%)'
      },
      toolbox: {
        show: false,
        feature: {
          magicType: {
            type: ['pie', 'funnel']
          },
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '户数',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {
              value: dwnsrNum,
              name: '单位纳税人'
            },
            {
              value: gtnsrNum,
              name: '个体'
            }
          ]
        }
      ]
    };

    this.dwGtTaxChartOpt = {
      title: {
        text: '税收（万元）'
      }, color: ['#006cff', '#16fcff'],
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}:{c}({d}%)'
      },
      toolbox: {
        show: false,
        feature: {
          magicType: {
            type: ['pie', 'funnel']
          },
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '税收',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            {
              value: Math.round(dwnsrTax / 10000),
              name: '单位纳税人'
            },
            {
              value: Math.round(gtnsrTax / 10000),
              name: '个体'
            }
          ]
        }
      ]
    }
  }

  // 左侧仪表盘
  initLeftChart(ybnsrNum, ybnsrTax, xgmnsrNum, xgmnsrTax, dwnsrNum, dwnsrTax, gtnsrNum, gtnsrTax) {
    this.leftTopChartOpt1 = {
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
            formatter: '一般纳税人：{value}户'
          },
          data: [{ value: ybnsrNum, name: '企业户数' }]
        },

      ]
    };
    this.leftTopChartOpt2 = {
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
            formatter: '税收：{value}亿'
          },
          data: [{ value: (Math.round(ybnsrTax) / 100000000).toFixed(2), name: '税收' }]
        },

      ]
    };
    this.leftTopChartOpt3 = {
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
            formatter: '小规模纳税人：{value}户'
          },
          data: [{ value: xgmnsrNum, name: '户数占比' }]
        },

      ]
    };
    this.leftTopChartOpt4 = {
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
            formatter: '税收：{value}亿'
          },
          data: [{ value: (xgmnsrTax / 100000000).toFixed(2), name: '收入比重' }]
        },

      ]
    };
    this.leftTopChartOpt5 = {
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
            formatter: '单位纳税人：{value}户'
          },
          data: [{ value: dwnsrNum, name: '企业户数' }]
        },

      ]
    };
    this.leftTopChartOpt6 = {
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
            formatter: '税收：{value}亿'
          },
          data: [{ value: (Math.round(dwnsrTax) / 100000000).toFixed(2), name: '税收' }]
        },

      ]
    };
    this.leftTopChartOpt7 = {
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
            formatter: '个体纳税人：{value}户'
          },
          data: [{ value: gtnsrNum, name: '户数占比' }]
        },

      ]
    };
    this.leftTopChartOpt8 = {
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
            formatter: '税收：{value}亿'
          },
          data: [{ value: (gtnsrTax / 100000000).toFixed(2), name: '收入比重' }]
        },

      ]
    };
  }

  /**
   * 初始化分行业数据
   */
  initFhyData(swjg_dm?: string) {
    const $taxStream1 = this.http.get(this.sssrfhyUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM });
    const $hsStream2 = swjg_dm ? this.http.get(this.hyhsBySwjgdmUrl, { swjg_dm }) : this.http.get(this.hyhsSummaryUrl);
    forkJoin([$taxStream1, $hsStream2]).subscribe(resp => {
      this.loadSrv.close();
      const [cyhyResp, hsResp] = resp;
      const hsData = hsResp['data'];
      const hsSeriesData = [];
      const taxSeriesData = [];
      const xAxisData = [];
      // 获取门类税收数据
      const sortedData: IHyItem[] = cyhyResp.rows;
      const tmpMlmcData = sortedData.filter(i => !i.HY_MC.includes('合计') && !i.HY_MC.includes('产业'))
        .sort(order("SE_HJ"));
      const mlmcTaxData = [];
      MLMC.forEach(i => {
        const item1 = hsData.find(j => j.HYMC === i);
        const item2 = tmpMlmcData.find(j => j.HY_MC.trim() === i);
        if (item1 && item2) {
          mlmcTaxData.push({ ...item2, ...item1 });
        }
      });
      mlmcTaxData.sort(order("SE_HJ")).filter(i => i !== undefined)
        .splice(0, 5)
        .forEach(item => {
          taxSeriesData.push(Math.floor(item.SE_HJ * 100) / 100);
          hsSeriesData.push(item.HS)
          xAxisData.push(item.HY_MC.trim());
        });

      this.hyssChartOpt = {
        backgroundColor: "transparent",
        color: ['#006cff', '#16fcff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },

        legend: {
          show: true
        },
        grid: {
          top: '8%',
          left: '4%',
          right: '4%',
          bottom: '4%',
          containLabel: true
        },
        yAxis: [{
          type: 'value',
          name: '户数',
          position: 'left',
          axisLabel: {
          },
        },
        {
          type: 'value',
          name: '税收',
          position: 'right',
          axisLabel: {
          },
        }],
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            },
            rotate: 25,
            formatter(value) {
              if (value.length > 7) {
                return value.substring(0, 7) + "..";
              } else {
                return value;
              }
            }
          },

          data: xAxisData
        },
        series: [
          {
            name: '户数',
            type: 'bar',
            data: hsSeriesData
          }, {
            name: '税收',
            type: 'bar',
            yAxisIndex: 1,
            data: taxSeriesData
          }
        ]
      };
      if (this.hyssChart) {
        this.hyssChart.setOption(this.hyssChartOpt);
      }

    });


  }

  /**
   * 
   * @param swjg_dm 初始化分企业类型数据
   */
  initFqylxData(swjg_dm?: string) {
    const $taxStream1 = this.http.get(this.sssrfqylxUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM });
    const $hsStream2 = swjg_dm ? this.http.get(this.djzclxHsBySwjgUrl, { swjg_dm }) : this.http.get(this.djzclxHsSummaryUrl);
    forkJoin([$taxStream1, $hsStream2]).
      subscribe(resp => {

        const [taxResp, hsResp] = resp;
        const taxData = taxResp['rows'];
        const hsData = hsResp['data'];

        const hsSeriesData = [];
        const taxSeriesData = [];
        const xAxisData = [];

        const seriesDataObj = [];

        hsData.forEach(i => {
          const targetTaxItem = taxData.find(j => j.DJZCLX_MC.trim() === i.DJZCLXMC);
          if (targetTaxItem) {
            seriesDataObj.push({
              SE_HJ: Math.floor(targetTaxItem.SE_HJ * 100) / 100,
              HS: i.HS,
              DJZCLXMC: targetTaxItem.DJZCLX_MC.trim()
            });
            // taxSeriesData.push(Math.floor(targetTaxItem.SE_HJ * 100) / 100);
            // hsSeriesData.push(i.HS)
            // xAxisData.push(targetTaxItem.DJZCLX_MC.trim());
          }
        });

        seriesDataObj.sort(order('SE_HJ')).forEach(i => {
          taxSeriesData.push(i.SE_HJ);
          hsSeriesData.push(i.HS)
          xAxisData.push(i.DJZCLXMC.trim());
        });

        this.qylxChartOpt = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          color: ['#006cff', '#16fcff'],

          legend: {
            show: true
          },
          grid: {
            top: '8%',
            left: '4%',
            right: '4%',
            bottom: '4%',
            containLabel: true
          },
          yAxis: [{
            type: 'value',
            name: '户数',
            position: 'left',
            axisLabel: {
            },
          },
          {
            type: 'value',
            name: '税收',
            position: 'right',
            axisLabel: {
            },
          }],
          xAxis: {
            type: 'category',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#ffffff',  //更改坐标轴文字颜色
              },
              rotate: 25,
              formatter(value) {
                if (value.length > 7) {
                  return value.substring(0, 7) + "..";
                } else {
                  return value;
                }
              }
            },

            data: xAxisData.splice(0, 5)
          },
          series: [
            {
              name: '户数',
              type: 'bar',
              data: hsSeriesData.splice(0, 5)
            }, {
              name: '税收',
              type: 'bar',
              yAxisIndex: 1,
              data: taxSeriesData.splice(0, 5)
            }
          ]
        };



        if (this.qylxChart) {
          this.qylxChart.setOption(this.qylxChartOpt);
        }
      });


  }

  /**
   * 初始化一般纳税人小规模
   * @param swjg_dm 
   */
  initYbnsrXgm(swjg_dm?: string) {

  }

  /**
   * 初始化单位/个体纳税人
   * @param swjg_dm 
   */
  initDwGtNsr(swjg_dm?: string) {

  }

  /**
   * 切换专题数据源
   * ybnsr/xgm/zch/fzch/gtnsr/dwnsr
   * @param e 
   */
  switchLayer(e, el: NzButtonComponent) {
    console.log(e, el);
    this.selectedSyjg = e;
    if (this.selectedSyjgButton) {
      this.selectedSyjgButton.nzDanger = false;
      this.selectedSyjgButton.nzType = "primary";
      this.selectedSyjgButton = null;
    }
    this.selectedSyjgButton = el;
    el.nzDanger = true;
    el.nzType = "dashed";

    const targetSwjgData: ISyjgItem[] = this.syjgData.filter(i => i.LB === this.selectedSyjg);
    // 
    this.swjgGeojson.features.forEach(el => {
      const target = targetSwjgData.find(i => i.SWJGJC === el.properties.SWJGJC);
      Object.assign(el.properties, target);
    });
    // 
    const values = targetSwjgData.map(i => i['FLSL']);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const colorStops = getColorRange(minValue, maxValue, ColorTypes.baronRedBlue);

    (this.map.getSource('syjg-source') as any).setData(this.swjgGeojson);

    this.map.setPaintProperty('syjg-extrusion-layer', 'fill-extrusion-color', {
      property: 'FLSL',
      stops: colorStops
    });
    this.map.setPaintProperty('syjg-extrusion-layer', 'fill-extrusion-height', {
      property: 'FLSL',
      stops: [[minValue, 0], [maxValue, this.heightStop]]
    });
    this.map.setPaintProperty('grid-active', 'fill-extrusion-height', {
      property: 'FLSL',
      stops: [[minValue, 0], [maxValue, this.heightStop]]
    })
  }

  returnHome() {

    //this.initFhyData();
    //this.initFqylxData();
    //this.initSyjgfx();

    //setTimeout(() => {
    //  this.fly2target();
    //}, 100);
    location.reload();
  }
}

