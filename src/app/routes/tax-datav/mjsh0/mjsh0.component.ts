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


@Component({
  selector: 'app-mjsh0',
  templateUrl: './mjsh0.component.html',
  styleUrls: ['./mjsh0.component.scss']
})
export class TaxDatavMjsh0Component implements OnInit, AfterViewInit {

  mjssurl = 'datacenter/mjssdata'; //个税
  // 图例
  grades;
  from;
  to;
  // 企业信息
  qyInfro = {
    nsrmcInfro: "",//纳税人名称
    hyInfro: "X",   //行业
    ydlxInfro: "X", //用地类型
    mjssInfro: 0, //亩均税收
    sytdmjInfro: 0//税源土地面积
  }
  // echart信息
  echartMjsh;
  echartTax;
  echartArea;
  rightBottomChartOpt1;
  rightBottomChartOpt2;

  // (右侧)
  mjsh1Data = [];
  // 税务机关的亩均税收信息（左上）
  mjsh0Data = [];
  // 企业的亩均税收信息（某税务机关）
  qyMjshData = [];

  // 加载leaflet地图
  leafletMap;
  layerControl;
  leafletMapCityBoundary;
  leafletMapDistinctBoundary;
  leafletMapDistinctPolygons;
  mjssLayer;
  fxfxLayer;
  qxFlagLayer;


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
  ** （1）配置leaflet地图属性
  ** （2）加载leaflet地图时，运行的函数
  */
  mapOptions: {
    center: [37.39471, 120.9709],
    zoom: 9
  };
  leafletMapload(e) {
    const { map, layerControl } = e;
    this.leafletMap = map;
    this.layerControl = layerControl;
    (window as any).leafletMap = map;

    this.getMjshData();
    this.leafletMapAddDistinctBoundary();
    this.leafletMapAddCityBoundary();
    this.leafletMapAddDistinctPolygons();

    this.leafletMapAddDistrictSymbol();


    this.leafletMap.on("zoomed", function (e) {
      let zoom = this.leafletMap.getZoom();
      if (zoom > 10) {
        this.leafletMapDistinctPolygons.remove();
        this.layerControl.removeLayer('县镇边界图层');
      } else {
      }
    });

    this.leafletMapCityBoundary.setZIdex(1);
    this.leafletMapDistinctBoundary.setZIdex(2);
    this.leafletMapDistinctPolygons.setZIdex(3);
    this.qxFlagLayer.setZIdex(4);
    this.mjssLayer.setZIdex(5);
    this.fxfxLayer.setZIdex(6);

    //this.leafletMapAddMapLegend();
  }
  /*  [2]
  ** （1）获取税务机关的亩均税收数据
  ** 
  */
  getMjshData(swjg_dm?: string) {

    const $stream1 = this.http.get('assets/data/yt/亩均税收--税务机关分析.json');
    const $stream2 = this.http.get('assets/data/yt/SWJG.json');

    $stream1.subscribe(resp => {
      this.mjsh0Data = resp.RECORDS;
      this.mjsh0Data.sort(order('MJSS'));
      this.displayQYofSWJG("烟台高新区税务局");
    });
  }
  /*  [3]
  ** （1）显示高新区企业信息
  ** （2）显示企业信息
  */
  displayQYofSWJG(x2) {
    if (x2 == "烟台高新区税务局") {
      this.http.get('assets/data/yt/gxq_mjss.json').subscribe(resp => {
        this.qyMjshData = resp.features.map(i => i.properties).sort(order('MJSS')).filter((x) => x.NSRSBH != "91370600054954539W");

        this.leafletMap.flyTo([37.4236, 121.5243], 12);
        //this.layerControl.remove('县镇边界图层');
        this.leafletMapDistinctPolygons.remove();
        this.leafletMapAddMjshPolygon();
        this.leafletMapAddFxPolygon();

      })
    } else {

    }

  }
  displayQy(item) {
    this.qyInfro.nsrmcInfro = item.NSRMC;
    this.qyInfro.hyInfro = item.MLMC;
    this.qyInfro.ydlxInfro = item.TDYT;
    this.qyInfro.mjssInfro = item.MJSS;
    this.qyInfro.sytdmjInfro = item.YSTDMJ;
    this.initRightBottomChart();
  }
  /* [4]
  ** （1）添加leaflet 的城市边界 
  ** （2）添加leaflet 的区县边界
  ** （3）添加leaflet 的分区县亩均税收多边形
  ** （4）添加颜色，给分区县亩均税收地块
  ** （5）添加图例
  */
  leafletMapAddCityBoundary() {
    this.http.get('assets/data/yt/SJ_Polygon.json').subscribe(resp => {
      console.log("City Resp:", resp);
      this.leafletMapCityBoundary = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: "white",
            weight: 2,
            opacity: 1,
            color: 'blue',
            fillOpacity: 0
          }
        }
      }).addTo(this.leafletMap);
      //this.layerControl.addOverlay(leafletMapCityBoundary, '城市边界图层');
    });
  }
  leafletMapAddDistinctBoundary() {
    this.http.get('assets/data/yt/SWJG.json').subscribe(resp => {
      this.leafletMapDistinctBoundary = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: "blue",
            weight: 2,
            opacity: 1,
            color: 'blue',
            fillOpacity: 0
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', e => {
            console.log(feature.properties);
          })
        }
      }).addTo(this.leafletMap);
      //this.layerControl.addOverlay(leafletMapCityBoundary, '县镇边界图层');
    });
  }
  leafletMapAddDistinctPolygons() {
    this.http.get('assets/data/yt/SWJG.json').subscribe(resp => {
      var testList = resp.features;
      testList.forEach(el => {
        const target = this.mjsh0Data.find(i => i.SWJGJC.includes(el.properties.SWJGJC.trim()));
        Object.assign(el.properties, target);
        // 赋值mjsh1Data
        this.mjsh1Data.push(el.properties);
      });

      this.echartMjshFun();
      this.echartTaxFun();
      this.echartAreaFun();
      resp.features = testList;
      this.leafletMapDistinctPolygons = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: this.getColor0(feature.properties.MJSS),
            weight: 2,
            opacity: 1,
            color: 'blue',
            fillOpacity: 1,
            id: "distinctPolygons",
            minZoom: 7,
            maxZoom: 10
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', e => {
            if (feature.properties.NAME == "高新区") {
              this.displayQYofSWJG("烟台高新区税务局");
            } else {

            }
            console.log(feature.properties);

            layer.bindPopup(feature.properties.SWJGJC).openPopup();
          });
          layer.on('mousemove', e => {
            layer.bindPopup(feature.properties.SWJGJC);
          });
        }

      }).addTo(this.leafletMap);
    });
  }
  getColor0(d) {
    // const d = parseFloat(feature.properties.MJSS);
    const color = d > 15 ? COLORS.info[0] :
      d > 13 ? COLORS.info[1] :
        d > 11 ? COLORS.info[2] :
          d > 9 ? COLORS.info[3] :
            d > 7 ? COLORS.info[4] :
              d > 5 ? COLORS.info[5] :
                d > 3 ? COLORS.info[6] :
                  d > 1 ? COLORS.info[7] : COLORS.info[8];
    return color;
  }

  /* [5]
  ** （1）添加leaflet亩均税收的多边形
  ** （2）添加leaflet风险地的多边形
  ** （3）添加颜色，给亩均税收地块
  */
  leafletMapAddMjshPolygon() {
    this.http.get('assets/data/yt/gxq_mjss.json').subscribe(resp => {
      console.log("Mjsh Resp:", resp);
      this.mjssLayer = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: this.getColor(feature.properties.MJSS),
            weight: 2,
            opacity: 0.5,
            color: 'white',
            fillOpacity: 0.6,
            minZoom: 7,
            maxZoom: 10
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', e => {
            const { ALL_VALUE, NSRMC, MLMC, DWSE, TDYT, YSTDMJ, MJSS, SWJGJC } = feature.properties;
            const html = `
            <h5>纳税人：${NSRMC}</h5>
              <h5>税务机关：${SWJGJC}</h5>
              <h5>所属行业：${MLMC}</h5>
              <h5>土地用途：${TDYT}</h5>
              <h5>占地面积：${(YSTDMJ)}亩</h5>
              <h5>单位税额：${DWSE}元/平方米</h5>
              <h5>亩均税收：${Math.round(MJSS * 100) / 100}万元/亩</h5>`;
            layer.bindPopup(html).openPopup();
          })
        }
      }).addTo(this.leafletMap);
      this.layerControl.addOverlay(this.mjssLayer, '亩均税收图层');
    });
  }
  leafletMapAddFxPolygon() {
    this.http.get('assets/data/yt/YT_FXFX.json').subscribe(resp => {
      this.fxfxLayer = L.geoJSON(resp, {
        style: (feature) => {
          return {
            fillColor: 'red',
            weight: 2,
            opacity: 0.5,
            color: 'white',
            fillOpacity: 0.4
          }
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', e => {
            const { TDSYBH, NSRSBH, NSRMC, FXLX, HCSL, HCMJ, SBMJ } = feature.properties;
            const html = `
            <h5>纳税人名称：${NSRMC}</h5>
              <h5>土地税源编号：${TDSYBH}</h5>
              <h5>风险类型：${FXLX}</h5>
              <h5>单位税额：${HCSL}</h5>
              <h5>金三申报面积：${SBMJ}平方米</h5>
              <h5 style="color:red">实际占地面积：${(HCMJ)}平方米</h5>
              <h5 style="color:red">面积差额：${ Math.floor((HCMJ - SBMJ) * 100) / 100}平方米</h5>
              `;
            layer.bindPopup(html).openPopup();
          })
        }
      }).addTo(this.leafletMap);
      this.layerControl.addOverlay(this.fxfxLayer, '土地税源疑点');
    });
  }
  getColor(d) {
    // const d = parseFloat(feature.properties.MJSS);
    const color = d > 70 ? COLORS.danger[8] :
      d > 60 ? COLORS.danger[7] :
        d > 50 ? COLORS.danger[6] :
          d > 40 ? COLORS.danger[5] :
            d > 30 ? COLORS.danger[4] :
              d > 20 ? COLORS.danger[3] :
                d > 10 ? COLORS.danger[2] :
                  d > 5 ? COLORS.danger[1] : COLORS.danger[0];
    return color;
  }
  /* [6]
  ** （1）区县标记
  */
  leafletMapAddDistrictSymbol() {
    this.http.get('assets/data/yt/swjg_point.json').subscribe(resp => {
      console.log("resp:", resp);
      this.qxFlagLayer = L.geoJSON(resp, {
        pointToLayer: function (geoJsonPoint, latlng) {
          const myIcon = L.divIcon({
            html: geoJsonPoint.properties.NAME,
            className: "my-div-icon"
          });
          return L.marker(latlng, { icon: myIcon });
        }
      }).addTo(this.leafletMap);

    });
  }
  /* [7]
  ** （1）添加echart
  **  1）echartMjsh
  **  2) echartTax
  **  3) echart 仪表盘
  */
  echartMjshFun() {
    this.mjsh1Data.sort(order('MJSS'));
    var xList = [];
    var yList = [];
    this.mjsh1Data.forEach(el => {
      xList.push(el.NAME);
      yList.push(el.MJSS);
    });
    this.echartMjsh = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '-3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        x: '80%',
        y: '10%',
        data: ['2019', '2020'],
        textStyle: {
          color: '#02d2ff',
          fontSize: 14
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xList,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#76c0ff',
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          axisLabel: {
            color: '#76c0ff'
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      color: ['#16fcff'],
      series: [
        {
          name: '2020',
          type: 'bar',
          barWidth: '10px',
          data: yList,
          formatter: '{c}万',
          fontSize: 10,
        }
      ]
    };
  }
  echartTaxFun() {
    this.mjsh1Data.sort(order('ALL_VALUE'));
    var xList = [];
    var yList = [];
    this.mjsh1Data.forEach(el => {
      xList.push(el.NAME);
      yList.push(el.ALL_VALUE);
    });

    console.log("xList: ", xList);


    this.echartTax = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '-3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        x: '80%',
        y: '10%',
        data: ['2019', '2020'],
        textStyle: {
          color: '#02d2ff',
          fontSize: 14
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xList,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#76c0ff',
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          axisLabel: {
            color: '#76c0ff'
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      color: ['#006cff'],
      series: [
        {
          name: '2020',
          type: 'bar',
          barWidth: '10px',
          data: yList,
          formatter: '{c}万',
          fontSize: 10,
        }
      ]
    };
  }
  echartAreaFun() {
    this.mjsh1Data.sort(order('ZDMJ_M'));
    var xList = [];
    var yList = [];
    this.mjsh1Data.forEach(el => {
      xList.push(el.NAME);
      yList.push(el.ZDMJ_M);
    });

    console.log("xList: ", xList);


    this.echartArea = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '-3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        x: '80%',
        y: '10%',
        data: ['2019', '2020'],
        textStyle: {
          color: '#02d2ff',
          fontSize: 14
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xList,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#76c0ff',
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          },
          axisLabel: {
            color: '#76c0ff'
          },
          splitLine: {
            lineStyle: {
              color: "#0d2e4c"
            }
          }
        }
      ],
      color: ['#16fcff'],
      series: [
        {
          name: '2020',
          type: 'bar',
          barWidth: '10px',
          data: yList,
          formatter: '{c}万',
          fontSize: 10,
        }
      ]
    };
  }
  initRightBottomChart() {

    this.rightBottomChartOpt1 = {
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
            formatter: '亩均税收：{value}（万/亩）'
          },
          data: [{ value: (this.qyInfro.mjssInfro).toFixed(2), name: '企业户数' }]
        },

      ]
    };
    this.rightBottomChartOpt2 = {
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
            formatter: '应税面积：{value}亩'
          },
          data: [{ value: (this.qyInfro.sytdmjInfro).toFixed(2), name: '应税面积' }]
        },

      ]
    };
  }
  /*  [x]
  ** （1）不知道是什么的函数声明
  ** （2）TaxDatavMjsh0Component的接口的实现
  */
  _onReuseDestroy: () => void;
  destroy: () => void;
  ngOnInit() {
    setTimeout(() => {
      this.taxDataVSrv.title = '亩均税收';
    });
  }
  ngAfterViewInit() {
  }
}
