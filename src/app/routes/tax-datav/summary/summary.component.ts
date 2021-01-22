import { TaxDataVService } from './../tax-data-v.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { COLORS, ColorTypes, getColorRange, order } from '@shared';
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
  selector: 'app-tax-datav-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class TaxDatavSummaryComponent implements OnInit, AfterViewInit {

  // 区县名字，目前选择的
  distinctName = "";

  // 税源结构
  syjgList = [];

  sssrMonthlyList = [];
  sssrCurSwjgName = "烟台";
  sssrCurSwjg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


  xdata = [];

  // 行业分析
  nsgmChartOpt;
  nsgmChart;
  syjgfxChartOpt;
  syjgfxChart;

  //#region  税收分级次变量、参数

  // date_key: "20200929"
  // page: 1
  // pageNum: 1
  // pageSize

  ssfjcUrl = "datacenter/sssrfjc"; //税收分级次
  zsxmUrl = 'datacenter/sssrfsz'; //征收项目
  cyhyUrl = 'datacenter/sssrfcyhy'; //产业行业
  syjgUrl = 'datacenter/syjg';// 税源结构分析
  monthlyUrl = 'datacenter/monthly';//逐月税收数据
  grsdsUrl = 'datacenter/grsds'; //个税
  mjssurl = 'datacenter/mjssdata'; //个税

  totalItem: ISsfjcItem = {};

  //#endregion
  // 企业的亩均税收信息（某税务机关）
  qyMjshData = [];
  // 税务机关的亩均税收信息（左上）
  mjsh0Data = [];
  mjsh1Data = [];


  style = decimal;
  lastStyle;
  map: mapboxgl.Map;// map 
  heightStop = 20000;
  gridActive = {
    type: "FeatureCollection",
    features: []
  };
  empty = {
    type: "FeatureCollection",
    features: []
  };
  colorActive = "yellow";
  minTax;
  maxTax;
  // 
  cyssChartOpt; // 产业税收饼图
  cyssChart;
  hyssChartOpt; // 行业税收柱状图
  hyssChart;
  hyssChartTitle = "行业税收分析";
  zsxmChartOpt; // 征收项目税收柱状图
  zsxmChart;
  xzqhChartOpt; // 行政区划税收饼状图
  xzqhChart;

  cyssData: IHyItem[] = [];
  zsxmData: IZsxmItem[] = [];
  ssfjcData: ISsfjcItem[] = [];

  countyVisible = false;
  selectedXzqh = {
    NAME: '',
    SE_HJ_LJ_BQ: 0,
    SE_HJ_LJ_BQ_ZJBL: 0,
    SE_HJ_LJ_BQ_ZJE: 0,
  };
  constructor(public http: _HttpClient,
    private cacheSrv: CacheService,
    public taxDataVSrv: TaxDataVService) {

  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.taxDataVSrv.title = '税收数据空间可视化分析平台';
    });
  }

  /**
   * 
   * @param e mapbox map loaded event
   */
  mapboxLoad(e) {
    this.map = e;
    this.lastStyle = this.map.getStyle();
    (window as any).map = this.map;
    this.addCityBoundary();
    this.initSsfjcData();
    this.fly2target();

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
        this.countyVisible = true;
        const target = queryPoint[0];
        const { SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME, SWJG_DM } = target.properties;
        console.log(SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME, SWJG_DM);
        setTimeout(() => {
          this.selectedXzqh = {
            SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME
          };

        });

        this.gridActive.features = [target];
        (this.map.getSource("grid-active") as any).setData(this.gridActive);
        this.map.getCanvas().style.cursor = "pointer";
        html = `<h5>行政区划：${NAME}</h5>
          <h5>收入额&nbsp;&nbsp;：${(SE_HJ_LJ_BQ / 10000).toLocaleString()}亿</h5>
          <h5>同比增减：${(SE_HJ_LJ_BQ_ZJE / 10000).toLocaleString()}亿</h5>
          <h5>同比增幅：${SE_HJ_LJ_BQ_ZJBL}%</h5>`;

        popup
          .setLngLat(coords as any)
          .setHTML(html)
          .addTo(this.map);


      } else {
        (this.map.getSource("grid-active") as any).setData(this.empty);
        this.map.getCanvas().style.cursor = "";
        popup.remove();
        this.countyVisible = false;
      }
    });
    this.map.on("click", e => {
      let html = "";
      const coords = [e.lngLat.lng, e.lngLat.lat];
      const queryPoint = this.map.queryRenderedFeatures(e.point, {
        layers: ["ssfjc-extrusion-layer"]
      });
      if (queryPoint.length) {
        this.countyVisible = true;
        const target = queryPoint[0];
        const { SE_HJ_LJ_BQ, SE_HJ_LJ_BQ_ZJE, SE_HJ_LJ_BQ_ZJBL, NAME, SWJG_DM } = target.properties;
        this.hyssChartTitle = `${NAME}五大行业`;
        this.distinctName = NAME;
        this.displayQYofSWJG(NAME);
        // 获取对应区县产业行业数据【下钻】
        if (SWJG_DM) {
          this.http.get('datacenter/sssrfcyhy', {
            SWJG_DM
          }).subscribe(cyhyResp => {
            console.log('cyhyResp:', cyhyResp);
            const tmpData = cyhyResp.rows.filter(i => !i.HY_MC.includes('合计') && !i.HY_MC.includes('产业'))
              .sort(order("SE_HJ"));

            const topHyData = [];
            tmpData.forEach(i => {
              const target = MLMC.find(j => i.HY_MC.trim() === j);
              if (!target) {
                topHyData.push({
                  HY_DM: i.HY_DM,
                  HY_MC: i.HY_MC,
                  SE_HJ: Math.round(i.SE_HJ)
                })
              }
            });
            //获取Top 5 行业
            const axisData = [];
            const seriesData = [];
            const top5HyData = [...topHyData].sort(order('SE_HJ'))
              .splice(0, 5).map(i => {
                axisData.push(i.HY_MC);
                seriesData.push(Math.round(i.SE_HJ));
                return {
                  HY_DM: i.HY_DM,
                  HY_MC: i.HY_MC,
                  SE_HJ: Math.round(i.SE_HJ)
                }
              });


            this.hyssChartOpt = {
              backgroundColor: "transparent",
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              color: ['#7528e9', '#0054ff', '#af8300',
                '#7b5c00', '#ff569a', '#8c97cb', '#8c97cb', '#80c269'],
              grid: {
                top: '1%',
                left: '0%',
                right: '0%',
                bottom: '4%',
                containLabel: true
              },

              xAxis: {
                show: false,
                type: 'value',
                axisLabel: {
                  show: false,
                  textStyle: {
                    color: '#ffffff',  //更改坐标轴文字颜色
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                }
              },
              yAxis: {
                type: 'category',
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#ffffff',  //更改坐标轴文字颜色
                  },
                  formatter(value) {
                    if (value.length > 7) {
                      return value.substring(0, 7) + "..";
                    } else {
                      return value;
                    }
                  }
                },

                data: axisData.reverse()
              },
              series: [
                {
                  type: 'bar',
                  stack: '总量',
                  barWidth: 30,
                  label: {
                    show: false,
                    position: 'insideRight'
                  },
                  data: seriesData.reverse(),
                  labelLine: {
                    normal: {
                      show: false
                    }
                  }
                }
              ]
            };
            setTimeout(() => {
              this.hyssChart.setOption(this.hyssChartOpt);
            });
          });

          this.initCyss(SWJG_DM);
          this.initZsxmss(SWJG_DM);
          this.initSyjgfx(SWJG_DM);
          this.initMonthlyData(SWJG_DM);
        }

      } else {
        (this.map.getSource("grid-active") as any).setData(this.empty);
        this.map.getCanvas().style.cursor = "";
        popup.remove();
        this.countyVisible = false;
      }

    });
    // 初始化各专题数据
    this.initCyss();
    this.initZsxmss();
    this.initHyss();
    this.initSyjgfx();
    //月收入数据
    this.initMonthlyData();
    this.initMjss();
    // this.sssrMonthlyDataRefresh();

  }

  /**
  * 左1：税收收入按月分布
  * (1)设置查询参数
  * (2)获取按月的15个税务管辖区的税收数据
  * (3)烟台市echsarts图表更新
  * (4)某个被选中的税务机关的echsarts图表更新
  */
  getCondition(yearNum, startMonthNum, endMonthNum) {
    return {
      year: yearNum,
      startMonth: startMonthNum,
      endMonth: endMonthNum,
      budgetValue: [1, 2, 3, 4].toLocaleString(),
    }
  }

  initMjss(swjg_dm?: string) {
    // console.log(">>>>>>>>>>>>>>>>++++++++++++++++++++++++++");
    // this.http.get(this.mjssurl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM }).subscribe(resp => {
    //   console.log("亩均税收", resp);


    // });
    const $stream1 = this.http.get('assets/data/yt/亩均税收--税务机关分析.json');

    $stream1.subscribe(resp => {
      // 税收分级次数据
      this.mjsh0Data = resp.RECORDS;
      this.mjsh0Data.sort(order('MJSS'));
      this.mjsh1Data = resp.RECORDS;
      this.mjsh1Data.sort(order('MJSS'));
    });
  }

  /**
  * 右2：亩均税收
  **/
  displayQYofSWJG(x2) {
    var Name = "";
    for (var i = 0; i < 15; i++) {
      if (SWJG[i][1] == x2) {
        this.sssrCurSwjgName = SWJG[i][0];
        Name = SWJG[i][0]
      }
    }

    if (x2 == "烟台高新技术产业开发区") {
      this.http.get('assets/data/yt/gxq_mjss.json').subscribe(resp => {
        this.mjsh0Data = resp.features.map(i => i.properties).sort(order('MJSS'));
      })
    } else {
      console.log("xxxxxx", Name);
      console.log("this.mjsh1Data", this.mjsh1Data[0].SWJGJC);
      for (var i = 0; i < this.mjsh1Data.length; i++) {
        if (this.mjsh1Data[i].SWJGJC == Name) {
          var item = this.mjsh1Data[i];
          this.mjsh0Data = [];
          this.mjsh0Data.push(item);
        } else {

        }
        this.mjsh1Data[0]

      }


    }

  }
  /**
   * 添加当前市边界
   */
  addCityBoundary() {
    const $stream1 = this.http.get('assets/data/yt/SJ_Polygon.json');
    $stream1.subscribe(resp => {
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
  }

  /**
   * 初始化税收分级次数据
   */
  initSsfjcData() {

    // 判断是否存在行政区划数据数据源及图层
    if (this.map.getLayer('ssfjc-extrusion-layer')) {
      this.map.removeLayer('ssfjc-extrusion-layer');
    }
    if (this.map.getSource('ssfjc-source')) {
      this.map.removeSource('ssfjc-source')
    }
    // 判断是否存在高亮区域块数据源及图层
    if (this.map.getLayer('grid-active')) {
      this.map.removeLayer('grid-active');
    }
    if (this.map.getSource('grid-active')) {
      this.map.removeSource('grid-active')
    }

    // 1、获取税收分级次实时情况
    const $stream1 = this.http.get(this.ssfjcUrl);
    // 2、税款国库对应geojson
    const $stream2 = this.http.get('assets/data/yt/SKGK.geojson');
    // 个税
    const $stream3 = this.http.get(this.grsdsUrl);
    // 3、构造专题数据
    forkJoin([$stream1, $stream2, $stream3])
      .subscribe(resp => {
        // 税款国库geo数据
        const skgkResp = resp[1];
        // 税收分级次数据
        const ssfjcData: ISsfjcItem[] = resp[0].rows;
        const grsdsData = resp[2].data;
        // 4、获取烟台市统计数据
        const total1 = ssfjcData.find(i => i.SWJG_MC === '烟台市');
        total1.SE_HJ_LJ_BQ = grsdsData.sre + total1.SE_HJ_LJ_BQ;
        total1.SE_HJ_LJ_BQ_ZJE = grsdsData.btq + total1.SE_HJ_LJ_BQ_ZJE;
        this.totalItem = { ...total1 };
        this.cacheSrv.set('totalTax', this.totalItem);

        // 5、合并税款数据至properties
        skgkResp.features.forEach(el => {
          const target = ssfjcData.find(i => i.SWJG_MC.includes(el.properties.NAME));
          Object.assign(el.properties, target);
        });
        this.ssfjcData = skgkResp.features.map(i => i.properties).sort(order('SE_HJ_LJ_BQ'));
        // 6、加载geo
        const taxValues = ssfjcData.filter(i => i.SWJG_MC !== '烟台市').map(i => i['SE_HJ_LJ_BQ']);
        const taxMax = Math.max(...taxValues);
        const taxMin = Math.min(...taxValues);
        console.log(taxMin, taxMax);
        const colorStops = getColorRange(taxMin, taxMax, ColorTypes.danger);

        if (!this.map.getSource('ssfjc-source')) {
          this.map.addSource('ssfjc-source', {
            'type': 'geojson',
            'data': skgkResp as any
          });
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


        // 创建饼图

        const xAxisData = [];
        const seriesData = [];
        this.ssfjcData.forEach(i => {
          xAxisData.push((i as any).NAME);
          seriesData.push((i['SE_HJ_LJ_BQ'] / 10000).toLocaleString());
        });
      });
  }

  /**
   * 初始化产业税收
   */
  initCyss(swjg_dm?: string) {
    this.http.get(this.cyhyUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM }).subscribe(resp => {
      this.cyssData = resp.rows.filter(i => i.HY_MC.includes('产业') && i.HY_MC.includes('第'));
      const seriesData = this.cyssData.map(i => {
        return {
          name: i.HY_MC,
          value: (Math.round(i.SE_HJ)).toLocaleString()
        }
      });
      //  初始化行业分析饼图
      let HyfxData = [];
      this.cyssData.forEach(element => {
        let HyfeElement = {};
        HyfeElement["name"] = element.HY_MC;
        HyfeElement["value"] = (element.SE_HJ / 10000).toFixed(2);
        HyfxData.push(HyfeElement);
      });
      this.initGsqyNsgmChart(HyfxData);

      // 
      this.cyssChartOpt = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c}({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['pie', 'funnel']
            },
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [Number(seriesData[0]) / 10000, Number(seriesData[1]) / 10000, Number(seriesData[2]) / 10000],
            itemStyle: {
              normal: {
                color(params) {
                  // 自定义颜色
                  const colorList = [
                    'rgb(121,100,19)', 'rgb(79,176,93)', 'rgb(32,104,195)'
                  ];
                  return colorList[params.dataIndex]
                }
              }
            }

            // itemStyle: {
            //   emphasis: {
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: 'rgba(0,0,0,0.5)'
            //   }
            // }
          }
        ]
      }

      if (this.cyssChart) {
        this.cyssChart.setOption(this.cyssChartOpt);
      }
    });

  }
  /**
   * 初始税源结构
   */
  initSyjgfx(swjg_dm?: string) {
    this.http.get(this.syjgUrl, {
      swjg_dm
    }).subscribe(resp => {
      const [ybnsrItem, xgmItem, zchItem, fzchItem, dwnsrItem, gtItem] = resp.data;
      console.log("resp.data:", resp.data);

      this.syjgList = resp.data;

      this.syjgfxChartOpt = {
        backgroundColor: "transparent",
        color: ['#fce53d', '#45be89',
          '#fce53d', '#45be89',
          '#fce53d', '#45be89',
          '#fce53d', '#45be89', ,
          '#b8a000', '#ffea59'],
        angleAxis: {
          type: 'category',
          data: ['一般/小规模纳税人', '正常/非正常户', '单位/个体纳税人', '纳税户/非纳税户']
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross'
          // },
          formatter(params) {
            // console.log(params);
            let tips = '';
            params.forEach(i => {
              if (i.data && i.value) {
                tips += `${i.seriesName}：${i.data || i.value}<br>`
              }
            });
            return tips;
          }
        },
        radiusAxis: {
          axisLabel: {
            show: false
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        polar: {
          radius: '66%',
          center: ['40%', '50%']
        },
        series: [{
          type: 'bar',
          //data: [1, 0, 0, 0, 0],
          data: [this.syjgList.find(i => i.LB == "ybnsr").FLSL, 0, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '一般纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [this.syjgList.find(i => i.LB == "xgm").FLSL, 0, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '小规模纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, this.syjgList.find(i => i.LB == "zch").FLSL, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '正常户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, this.syjgList.find(i => i.LB == "fzch").FLSL, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '非正常户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, this.syjgList.find(i => i.LB == "dwnsr").FLSL, , 0, 0],
          coordinateSystem: 'polar',
          name: '单位纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, this.syjgList.find(i => i.LB == "gtnsr").FLSL, , 0, 0],
          coordinateSystem: 'polar',
          name: '个体纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, this.syjgList.find(i => i.LB == "nsh").FLSL, 0],
          coordinateSystem: 'polar',
          name: '纳税户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, this.syjgList.find(i => i.LB == "nsh").GLHSL - this.syjgList.find(i => i.LB == "nsh").FLSL, 0],
          coordinateSystem: 'polar',
          name: '非纳税户',
          stack: 'a'
        }],
        legend: {
          top: 20,
          bottom: 20,
          right: 2,
          orient: 'vertical',
          type: 'scroll',
          data: ['一般纳税人', '小规模纳税人', '正常户', '非正常户', '单位纳税人', '个体纳税人', '纳税户', '非纳税户']
        }
      };/*{
        backgroundColor: "transparent",
        color: ['#65009a', '#ca63ff', '#001db2',
          '#516eff', '#00b0a1', '#57fff1', '#00ad45', '#67ffa4', '#b8a000', '#ffea59'],
        angleAxis: {
          type: 'category',
          data: ['一般/小规模纳税人', '正常/非正常户', '单位/个体纳税人', '纳税户/非纳税户', '小型微利/非小型微利企业']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        radiusAxis: {
          axisLabel: {
            show: false
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        polar: {
          radius: '66%',
          center: ['40%', '50%']
        },
        series: [{
          type: 'bar',
          //data: [1, 0, 0, 0, 0],
          data: [this.syjgList.find(i => i.LB == "ybnsr").FLSL, 0, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '一般纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [this.syjgList.find(i => i.LB == "xgm").FLSL, 0, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '小规模纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, this.syjgList.find(i => i.LB == "zch").FLSL, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '正常户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, this.syjgList.find(i => i.LB == "fzch").FLSL, 0, 0, 0],
          coordinateSystem: 'polar',
          name: '非正常户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, this.syjgList.find(i => i.LB == "dwnsr").FLSL, , 0, 0],
          coordinateSystem: 'polar',
          name: '单位纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, this.syjgList.find(i => i.LB == "gtnsr").FLSL, , 0, 0],
          coordinateSystem: 'polar',
          name: '个体纳税人',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, this.syjgList.find(i => i.LB == "nsh").FLSL, 0],
          coordinateSystem: 'polar',
          name: '纳税户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, this.syjgList.find(i => i.LB == "nsh").GLHSL - this.syjgList.find(i => i.LB == "nsh").FLSL, 0],
          coordinateSystem: 'polar',
          name: '非纳税户',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, 0, this.syjgList.find(i => i.LB == "xxwlqy").FLSL],
          coordinateSystem: 'polar',
          name: '小型微利企业',
          stack: 'a'
        }, {
          type: 'bar',
          data: [0, 0, 0, 0, this.syjgList.find(i => i.LB == "xxwlqy").GLHSL - this.syjgList.find(i => i.LB == "xxwlqy").FLSL],
          coordinateSystem: 'polar',
          name: '非小型微利企业',
          stack: 'a'
        }],
        legend: {
          top: 20,
          bottom: 20,
          right: 2,
          orient: 'vertical',
          type: 'scroll',
          data: ['一般纳税人', '小规模纳税人', '正常户', '非正常户', '单位纳税人', '个体纳税人', '纳税户', '非纳税户', '小型微利企业', '非小型微利企业']
        }
      };*/


      if (this.syjgfxChart) {
        this.syjgfxChart.setOption(this.syjgfxChartOpt);
      }
    });


  }
  /**
   * 初始化行业税收分析
   */
  initHyss(swjg_dm?: string) {

    this.http.get(this.cyhyUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM }).subscribe(cyhyResp => {
      const seriesData = [];
      const xAxisData = [];
      // 获取门类数据
      const sortedData: IHyItem[] = cyhyResp.rows;
      const tmpMlmcData = sortedData.filter(i => !i.HY_MC.includes('合计') && !i.HY_MC.includes('产业'))
        .sort(order("SE_HJ")).map(i => {
          return Object.assign(i, { SE_HJ: Math.round(i.SE_HJ) })
        });

      const mlmcTaxData = MLMC.map(i => {
        return tmpMlmcData.find(j => j.HY_MC.trim() === i);
      }).sort(order("SE_HJ")).filter(i => i !== undefined)
        .splice(0, 10)
        .forEach(item => {
          seriesData.push(Math.round(item.SE_HJ));
          xAxisData.push(item.HY_MC.trim());
        });
      // .filter(i => i && i.HY_MC.trim() !== '制造业').sort(order("SE_HJ"));

      // 获取制造业子类行业数据
      const topHyData = tmpMlmcData.filter(i => i && i.HY_MC.includes('制造') && i.HY_MC.trim() !== '制造业' ||
        (i.HY_MC.includes('加工') && i.HY_MC.trim() !== '加工') ||
        (i.HY_MC.includes('制品') && i.HY_MC.trim() !== '制品') ||
        (i.HY_MC.includes('工业') && i.HY_MC.trim() !== '工业') ||
        i.HY_MC.includes('电力、蒸汽')
      )
        .sort(order("SE_HJ"));

      this.hyssChartOpt = {
        backgroundColor: "transparent",
        legend: {
          top: 0,
          left: 10,
          orient: 'horizontal',
          type: 'scroll',
          data: [topHyData[0].HY_MC, topHyData[1].HY_MC, topHyData[2].HY_MC, topHyData[3].HY_MC, topHyData[4].HY_MC]
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        grid: {
          top: '13%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        color: ['#7528e9', '#0054ff', '#af8300',
          '#7b5c00', '#ff569a', '#8c97cb', '#8c97cb', '#80c269'],
        xAxis: {
          type: 'value',
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            },
            formatter(value) {
              if (value.length > 7) {
                return value.substring(0, 7) + "..";
              } else {
                return value;
              }
            }
          },
          //data: ['x', '房地产', '房地产', '周四', '房产', '金融', '制造业']
          data: xAxisData.reverse()
        },
        series: [
          {
            name: topHyData[0].HY_MC,
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight',

            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, topHyData[0].SE_HJ]
          },
          {
            name: topHyData[1].HY_MC,
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, topHyData[1].SE_HJ]
          },
          {
            name: topHyData[2].HY_MC,
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, topHyData[2].SE_HJ]
          },
          {
            name: topHyData[3].HY_MC,
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, topHyData[3].SE_HJ]
          },
          {
            name: topHyData[4].HY_MC,
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, topHyData[4].SE_HJ]
          },
          {
            name: '行业税收',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: [seriesData[9], seriesData[8], seriesData[7], seriesData[6], seriesData[5], seriesData[4], seriesData[3], seriesData[2], seriesData[1],
            seriesData[0] - topHyData[0].SE_HJ - topHyData[1].SE_HJ - topHyData[2].SE_HJ - topHyData[3].SE_HJ - topHyData[4].SE_HJ]
          }
        ]
      };/*{
        backgroundColor: "transparent",
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#7528e9', '#0054ff', '#af8300',
          '#7b5c00', '#ff569a', '#8c97cb', '#8c97cb', '#80c269'],
        grid: {
          top: '1%',
          left: '0%',
          right: '0%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          axisLabel: {
            show: false,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            },
            formatter(value) {
              if (value.length > 7) {
                return value.substring(0, 7) + "..";
              } else {
                return value;
              }
            }
          },

          data: xAxisData.reverse()
        },
        series: [
          {
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: seriesData.reverse(),
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      };*/


    });

    if (this.hyssChart) {
      this.hyssChart.setOption(this.hyssChartOpt);
    }
  }

  /**
   * 初始化按税种征收情况
   */
  initZsxmss(swjg_dm?: string) {
    this.http.get(this.zsxmUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM }).subscribe(resp => {
      const seriesData = [];
      const xAxisData = [];
      const zsxmData: IZsxmItem[] = resp.rows;
      zsxmData.filter(i => !i.ZSXM_DM.includes('10100') && !i.ZSXM_DM.includes('101010'))
        .sort(order('LJSRE'))
        .forEach(i => {
          seriesData.push((i.LJSRE / 10000).toLocaleString());
          xAxisData.push(i.ZSXM_MC);
        });
      //  初始化征收项目分析条形图
      let pieData = [];
      for (let i = 0; i < 15; i++) {
        let HyfeElement = {};
        HyfeElement["name"] = xAxisData[i];
        HyfeElement["value"] = seriesData[i];
        pieData.push(HyfeElement);
      }
      this.zsxmChartOpt = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: '分税种税收',
            type: 'pie',
            radius: ['20%', '60%'],
            roseType: 'area',
            avoidLabelOverlap: true,
            label: {
              formatter: '{b}({d}%)',
              color: (params) => {
                // 自定义颜色
                const colorList =
                  COLORS.primary;
                /* [

                   'rgb(0,78,255)',
                   'rgb(0,108,255)',
                   'rgb(0,138,255)',
                   'rgb(0,168,255)',
                   'rgb(0,198,255)'
                 ];*/
                // console.log(params, colorList[params.dataIndex]);
                return colorList[params.dataIndex]
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  // 自定义颜色
                  const colorList =
                    COLORS.info;

                  return colorList[params.dataIndex]
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: pieData
          }
        ]
      };/*{
        backgroundColor: "transparent",
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#006cff', '#0054ff', '#af8300',
          '#7b5c00', '#ff569a', '#8c97cb', '#8c97cb', '#80c269'],
        grid: {
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          axisLabel: {
            show: false,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',  //更改坐标轴文字颜色
            },
            formatter(value) {
              if (value.length > 7) {
                return value.substring(0, 7) + "..";
              } else {
                return value;
              }
            }
          },

          data: xAxisData.reverse()
        },
        series: [
          {
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: seriesData.reverse(),
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      };*/
      /*{
        backgroundColor: "transparent",
        title: {
          subtext: '单位：亿元',
          x: 'center'
        },
        color: ["#216BC6"],
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['line', 'bar']
            },
            saveAsImage: {}
          }
        },
        grid: {
          top: 30,
          bottom: 27,
          left: "25%",
          right: "4%"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          axisLabel: {
            interval: 0, // 0 强制显示所有，1为隔一个标签显示一个标签，2为隔两个
            // 标签旋转角度，在标签显示不下的时可通过旋转防止重叠
            textStyle: {
              fontSize: 12 // 字体大小
            }
          },
          data: xAxisData.reverse(),
        },
        series: [
          {
            data: seriesData.reverse(),
            type: "bar",
            itemStyle: {
              normal: {
                color(params) {
                  // 自定义颜色
                  // const colorList = COLORS.primary;
                  // return colorList[params.dataIndex]

                  return 'rgba(40,208,233, 0.9)';
                }
                // label: {
                //   show: true, //开启显示
                //   position: "top", //在上方显示
                //   textStyle: {
                //     //数值样式
                //     color: "yellow",
                //     fontSize: 12,
                //     fontWeight: "bolder"
                //   }
                // }
              }
            }
          }
        ]
      };*/

      if (this.zsxmChart) {
        this.zsxmChart.setOption(this.zsxmChartOpt);
      }

    });
  }
  /**
   * 月收入数据
   */
  initMonthlyData(swjg_dm?: string) {
    this.http.get(this.monthlyUrl, { SWJG_DM: swjg_dm ? swjg_dm : DEFAULT_SWJG_DM }).subscribe(resp => {
      console.log("><<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>");
      console.log(resp);
      const { monthValue } = resp.data;
      const seriesData = [], axisData = [];
      for (var i = 0; i < 12; i++) {
        if (i < monthValue.length) {
          axisData.push(`${i + 1}月`);
          seriesData.push(monthValue[i]);
        } else {
          axisData.push(`${i + 1}月`);
          seriesData.push(0);
        }
      }
      // monthValue.forEach((item, idx) => {
      //   axisData.push(`${idx + 1}月`);
      //   seriesData.push(item);
      // });

      this.xzqhChartOpt = {
        legend: {
          data: ["月税收（万元）"],
          right: 10
        },
        backgroundColor: "transparent",
        color: ['#16fcff', '#0054ff', '#af8300',
          '#7b5c00', '#ad03fc', '#ad03fc',],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '4%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: axisData,
            labelLine: {
              normal: {
                show: false
              }
            }

          },

        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#07e6ed',  //更改坐标轴文字颜色
              }
            },
            // labelLine: {
            //   normal: {
            //     show: false
            //   }
            // }
          }
        ],
        series: [
          {
            name: '月税收（万元）',
            type: 'line',
            stack: 'counts',
            smooth: true,
            data: seriesData
          },

        ]
      };

    });
  }

  /**
   * 获取区市税收
   * 
   * @param xzqhmc :行政区划名称
   */
  getCountyTax(xzqhmc: string) {
    this.initCyss();
    this.initHyss();
    this.initZsxmss();

  }

  /**
   * echarts 图表实例获取
   * @param e 
   */
  onCyssChartInit(e) {
    this.cyssChart = e;
  }
  onHyssChartInit(e) {
    this.hyssChart = e;
  }
  onZsxmChartInit(e) {
    this.zsxmChart = e;
  }
  onXzqhChartInit(e) {
    e.on('click', e => {
      this.countyVisible = true;
      // this.selectedXzqh.name = e.name;

      // this.getCountyTax(e.name);
    });
  }

  returnHome() {
    this.distinctName = "";
    this.countyVisible = false;
    this.initCyss();
    this.initZsxmss();
    this.initHyss();
    this.initSyjgfx();
    this.initMonthlyData();
    this.initMjss();
    setTimeout(() => {
      this.fly2target();
    });
  }

  fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: MAPBOX_POS.center as any,
      zoom: MAPBOX_POS.zoom,
      bearing: MAPBOX_POS.bearing,
      pitch: MAPBOX_POS.pitch,
      speed: 0.8
    });
  }
  /**
   * 初始化规上企业纳税规模图表
   * @param seriesData 
   */
  initGsqyNsgmChart(seriesData) {

    this.nsgmChartOpt = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      grid: {
        top: '6%',
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true
      },
      series: [
        {
          name: '产业税收',
          type: 'pie',
          radius: ['0%', '65%'],
          minAngle: 20,
          avoidLabelOverlap: true,
          label: {
            formatter: '{b}\n{c}亿 ({d}%)',
            color: (params) => {
              // 自定义颜色
              const colorList =
                [
                  '#fff600',
                  'rgb(91,252,3)',
                  'rgb(0,180,214)',
                  'rgb(0,168,255)',
                  'rgb(0,198,255)'
                ];
              // console.log(params, colorList[params.dataIndex]);
              return colorList[params.dataIndex]
            }
          },
          itemStyle: {
            normal: {
              color: (params) => {
                // 自定义颜色
                const colorList =
                  //  COLORS.primary;
                  [
                    '#fff600',
                    'rgb(91,252,3)',
                    'rgb(0,180,214)',
                    'rgb(0,168,255)',
                    'rgb(0,198,255)',
                  ];
                // console.log(params, colorList[params.dataIndex]);
                return colorList[params.dataIndex]
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: seriesData
        }
      ]
    };
  }

  //#region 数据中台接口


  //#endregion
}
