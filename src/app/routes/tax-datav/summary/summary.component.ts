import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { ColorTypes, getColorRange, order } from '@shared';
import { CacheService } from '@delon/cache';

// 税收分级次item接口
interface ssfjcItem {
  SE_HJ_BQ?: number,
  SE_HJ_BQ_ZJBL?: number,
  SE_HJ_BQ_ZJE?: number,
  SWJG_MC?: string
}
// 分税种zsxm接口
interface zsxmItem {
  BTQ: number,
  BTQSE: number,
  LJBTQ: number,
  LJBTQSE: number,
  LJSRE: number,
  ROW_ID: number,
  SRE: number,
  ZSXM_DM: string,
  ZSXM_MC: string,
};
interface cyItem {
  HY_DM: string,
  HY_MC: string,
  SE_HJ: number,
  SE_HJ_ZJBL: number,
  SE_HJ_ZJE: number,
};

interface ssfjcRes {
  code: number,
  msg: string,
  rows: ssfjcItem[],
  total: number
}
// mapbox pos参数
const MAPBOX_POS = {
  center: [120.657985, 37.24082995331422],
  pitch: 60,
  bearing: -10.441292648171384,
  zoom: 7.899747984494937
}

@Component({
  selector: 'app-tax-datav-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class TaxDatavSummaryComponent implements OnInit, AfterViewInit {

  //#region  税收分级次变量、参数

  // date_key: "20200929"
  // page: 1
  // pageNum: 1
  // pageSize

  ssfjcUrl = "/ssfjc";
  zsxmUrl = '/zsxm';
  cyhyUrl = '/cyhy';
  totalItem: ssfjcItem = {};

  //#endregion



  style = dark;
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
  zsxmChartOpt; // 征收项目税收柱状图
  zsxmChart;
  xzqhChartOpt; // 行政区划税收饼状图
  xzqhChart;

  cyssData: cyItem[] = [];
  hyssData = [];
  zsxmData: zsxmItem[] = [];
  ssfjcData: ssfjcItem[] = [];

  countyVisible = false;
  selectedXzqh = {
    name: '',
    bnd: '',
    tbzje: '',
    tbzjf: ''
  }
  constructor(public http: _HttpClient,
    private cacheSrv: CacheService) {

  }

  ngOnInit() {
  }
  ngAfterViewInit() {


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

    const styles = [
      {
        title: "灰色风格",
        uri: JSON.stringify(dark)
      },
      {
        title: "科技风格",
        uri: JSON.stringify(decimal)
      }
    ];
    const styleControl = new MapboxStyleSwitcherControl(styles);
    this.map.addControl(styleControl);
    this.fly2target();
    // this.initCzyxfx();
    // 地图样式切换事件监听
    this.map.on('styledata', styleData => {

      this.addCityBoundary();
      if (!styleData.style.getLayer('ssfjc-extrusion') && !styleData.style.getLayer('grid-active')) {
        this.initSsfjcData();
      }
    });
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
        const { SE_HJ_BQ, SE_HJ_BQ_ZJE, SE_HJ_BQ_ZJBL, NAME } = target.properties;
        this.gridActive.features = [target];
        (this.map.getSource("grid-active") as any).setData(this.gridActive);
        this.map.getCanvas().style.cursor = "pointer";
        html = `<h5>行政区划：${NAME}</h5>
          <h5>收入额&nbsp;&nbsp;：${SE_HJ_BQ.toLocaleString()}万</h5>
          <h5>同比增减：${parseFloat(SE_HJ_BQ_ZJE).toLocaleString()}万</h5>
          <h5>同比增幅：${SE_HJ_BQ_ZJBL}%</h5>`;

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

    // 
    this.initCyss();
    this.initZsxmss();
    this.initHyss();

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
    const $stream1 = this.http.post(this.ssfjcUrl, {
      date_key: "20200929",
      page: 1,
      pageNum: 1,
      pageSize: 50
    });
    // 2、税款国库对应geojson
    const $stream2 = this.http.get('assets/data/yt/SKGK.geojson');
    // 3、构造专题数据
    forkJoin([$stream1, $stream2])
      .subscribe(resp => {
        // 税款国库geo数据
        const skgkResp = resp[1];
        // 税收分级次数据
        const ssfjcData: ssfjcItem[] = resp[0].rows;
        // 4、获取烟台市统计数据
        this.totalItem = ssfjcData.find(i => i.SWJG_MC === '烟台市');
        this.cacheSrv.set('totalTax', this.totalItem);
        // 5、合并税款数据至properties
        skgkResp.features.forEach(el => {
          const target = ssfjcData.find(i => i.SWJG_MC.includes(el.properties.NAME));
          Object.assign(el.properties, target);
        });
        this.ssfjcData = skgkResp.features.map(i => i.properties).sort(order('SE_HJ_BQ'));
        // 6、加载geo
        const taxValues = ssfjcData.filter(i => i.SWJG_MC !== '烟台市').map(i => i.SE_HJ_BQ);
        const taxMax = Math.max(...taxValues);
        const taxMin = Math.min(...taxValues);
        console.log(taxMin, taxMax);
        const colorStops = getColorRange(taxMin, taxMax, ColorTypes.info);


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
                property: "SE_HJ_BQ",
                stops: colorStops
              },
              "fill-extrusion-height": {
                property: "SE_HJ_BQ",
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
                property: "SE_HJ_BQ",
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
        const seriesData = this.ssfjcData.map(i => {
          return {
            name: (i as any).NAME,
            value: i.SE_HJ_BQ
          }
        })
        this.xzqhChartOpt = {
          backgroundColor: 'transparent',
          // title:{
          //   text:'企业分布'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}:{c}({d}%)'
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              data: seriesData,
              itemStyle: {
                normal: {
                  color(params) {
                    // 自定义颜色
                    const colorList = [
                      'rgb(33,107,198)', 'rgb(57,153,219)', 'rgb(82,182,96)'
                      , 'rgb(92,206,115)', 'rgb(70,162,136)', 'rgb(86,201,171)', 'rgb(192,47,36)', 'rgb(228,75,57)'
                      , 'rgb(240,157,40)', 'rgb(217,178,35)'
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

      });
  }

  /**
   * 初始化产业税收
   */
  initCyss(xzqhmc?: string) {
    this.http.post(this.cyhyUrl).subscribe(resp => {
      this.cyssData = resp.rows.filter(i => i.HY_MC.includes('产业'));
      console.log('cyhydata:', this.cyssData);

      const seriesData = this.cyssData.map(i => {
        return {
          name: i.HY_MC,
          value: i.SE_HJ
        }
      });



      // if (xzqhmc) {
      //   this.cyssData = resp.data.data.filter(item => item.xzqhmc === xzqhmc);
      //   seriesData = resp.data.data
      //     .filter(item => item.xzqhmc === xzqhmc)
      //     .map(item => {
      //       return {
      //         name: item.cymc,
      //         value: item.bnd
      //       }
      //     });
      // } else {
      //   this.cyssData = resp.data.data;
      //   seriesData = resp.data.data.map(item => {
      //     return {
      //       name: item.cymc,
      //       value: item.bnd
      //     }
      //   });
      // }

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
            radius: '70%',
            center: ['50%', '50%'],
            data: seriesData,
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
    });
    if (this.cyssChart) {
      this.cyssChart.setOption(this.cyssChartOpt);
    }
  }

  /**
   * 初始化行业税收分析
   */
  initHyss(xzqhmc?: string) {
    this.http.post(this.cyhyUrl).subscribe(resp => {
      const seriesData = [];
      const xAxisData = [];
      const sortedData: cyItem[] = resp.rows;
      sortedData.filter(i => !i.HY_MC.includes('合计') && !i.HY_MC.includes('产业'))
        .sort(order("SE_HJ")).splice(0, 10).forEach(item => {
          seriesData.push(item.SE_HJ / 100000000);
          xAxisData.push(item.HY_MC.trim());
        });
      // if (xzqhmc) {
      //   sortedData
      //     .filter(item => item.xzqhmc === xzqhmc)
      //     .sort(order("bnd")).splice(0, 10)
      //     .forEach(item => {
      //       if (item.bnd != 0) {
      //         seriesData.push(item.bnd);
      //         xAxisData.push(item.mlmc);
      //       }
      //     });
      // } else {
      //   sortedData.sort(order("bnd")).splice(0, 10).forEach(item => {
      //     if (item.bnd != 0) {
      //       seriesData.push(item.bnd);
      //       xAxisData.push(item.mlmc);
      //     }
      //   });
      // }



      this.hyssChartOpt = {
        backgroundColor: "transparent",
        title: {
          subtext: '单位：亿元',
          x: 'center'
        },
        // color: ["#216BC6"],
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
          left: "27%",
          right: "4%"
        },
        xAxis: {
          type: "value",
          axisLine: { onZero: false },
          nameRotate: 0.1,// 使用这个属性
          nameLoaction: "center",
        },

        yAxis: [{
          // nameTextStyle: {
          //   fontSize: 14
          // },
          axisLabel: {
            interval: 0,
            // margin: 95,
            textStyle: {
              // align: 'left',
              // baseline: 'middle'
            },
            formatter(value) {
              if (value.length > 6) {
                return value.substring(0, 6) + "..";
              } else {
                return value;
              }
            }
          },
          type: 'category',
          data: xAxisData.reverse(),

        }],
        series: [
          {
            data: seriesData.reverse(),
            type: "bar",
            itemStyle: {
              normal: {
                color(params) {
                  // 自定义颜色
                  const colorList = [
                    'rgb(33,107,198)', 'rgb(57,153,219)', 'rgb(82,182,96)'
                    , 'rgb(92,206,115)', 'rgb(70,162,136)', 'rgb(86,201,171)', 'rgb(192,47,36)', 'rgb(228,75,57)'
                    , 'rgb(240,157,40)', 'rgb(217,178,35)'
                  ].reverse();
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      };
    });
    if (this.hyssChart) {
      this.hyssChart.setOption(this.hyssChartOpt);
    }
  }

  /**
   * 初始化按税种征收情况
   */
  initZsxmss(xzqhmc?: string) {
    this.http.post(this.zsxmUrl, {}).subscribe(resp => {
      const seriesData = [];
      const xAxisData = [];
      const zsxmData: zsxmItem[] = resp.rows;
      zsxmData.filter(i => !i.ZSXM_DM.includes('10100') && !i.ZSXM_DM.includes('101010'))
        .sort(order('LJSRE'))
        .forEach(i => {
          seriesData.push(i.LJSRE);
          xAxisData.push(i.ZSXM_MC);
        });

      if (xzqhmc) {
        // sortedData
        //   .filter(item => item. === xzqhmc)
        //   .sort(order("bnd"))
        //   .forEach(item => {
        //     if (item.bnd != 0) {
        //       seriesData.push(item.bnd);
        //       xAxisData.push(item.zsxmmc);
        //     }
        //   });
      } else {
        // sortedData.sort(order("bnd")).forEach(item => {
        //   if (item.bnd != 0) {
        //     seriesData.push(item.bnd);
        //     xAxisData.push(item.zsxmmc);
        //   }
        // });
      }

      this.zsxmChartOpt = {
        backgroundColor: "transparent",
        title: {
          subtext: '单位：万元',
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
          bottom: 57,
          left: "16%",
          right: "6%"
        },
        yAxis: {
          type: "value"
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 1, // 0 强制显示所有，1为隔一个标签显示一个标签，2为隔两个
            rotate: 30, // 标签旋转角度，在标签显示不下的时可通过旋转防止重叠
            textStyle: {
              fontSize: 12 // 字体大小
            }
          },
          data: xAxisData
        },
        series: [
          {
            data: seriesData,
            type: "bar",
            itemStyle: {
              normal: {
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
      };

      if (this.zsxmChart) {
        this.zsxmChart.setOption(this.zsxmChartOpt);
      }

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
      this.selectedXzqh.name = e.name;

      this.getCountyTax(e.name);
    });
  }

  returnHome() {
    this.countyVisible = false;
    this.initCyss();
    this.initZsxmss();
    this.initHyss();
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
}
