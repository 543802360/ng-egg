import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { order } from '@shared';


@Component({
  selector: 'app-tax-datav-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class TaxDatavSummaryComponent implements OnInit, AfterViewInit {
  bndzss; // 本年度总税收
  tbzjf; // 同比增减幅
  tbzje; // 同比增减额

  style = dark;
  lastStyle;
  map: mapboxgl.Map;// map 
  colorStops =
    [
      "rgb(1, 152, 189)",
      "rgb(73, 227, 206)",
      "rgb(216, 254, 181)",
      "rgb(254, 237, 177)",
      "rgb(254, 173, 84)",
      "rgb(209, 55, 78)"
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

  cyssData = [];
  hyssData = [];
  zsxmData = [];
  xzqhData = [];

  countyVisible = false;
  selectedXzqh = {
    name: '',
    bnd: '',
    tbzje: '',
    tbzjf: ''
  }
  constructor(public http: _HttpClient) {

  }

  ngOnInit() {
  }
  ngAfterViewInit() {


  }
  mapboxLoad(e) {
    this.map = e;
    this.lastStyle = this.map.getStyle();
    (window as any).map = this.map;
    this.addCityBoundary();
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
      // console.log('style change', styleData);
      // console.log(this.map.getStyle());
      // console.log(styleData.target.getStyle());
      // const targetStyle = { ...this.lastStyle, ...this.map.getStyle() };
      this.addCityBoundary();
      // if (!styleData.style.getLayer('xzqh-extrusion') && !styleData.style.getLayer('grid-active')) {
      //   setTimeout(() => {
      //     this.initCzyxfx();
      //   });
      // }
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "top"
    });
    // this.map.on("mousemove", e => {
    //   let html = "";
    //   const coords = [e.lngLat.lng, e.lngLat.lat];
    //   // console.log(e);
    //   const queryPoint = this.map.queryRenderedFeatures(e.point, {
    //     layers: ["xzqh-extrusion"]
    //   });
    //   if (queryPoint.length) {
    //     this.map.setPaintProperty("grid-active", "fill-extrusion-height", {
    //       property: "tax",
    //       stops: [[0, 0], [this.maxTax, this.heightStop]]
    //     });
    //     this.gridActive.features = [queryPoint[0]];
    //     (this.map.getSource("grid-active") as any).setData(this.gridActive);
    //     this.map.getCanvas().style.cursor = "pointer";
    //     if (queryPoint[0].properties.xzqh_mc) {
    //       html = `<h3>行&nbsp;政&nbsp;区&nbsp;划：${queryPoint[0].properties.xzqh_mc}</h3>
    //       <h3>本年度税收&nbsp;&nbsp;&nbsp;&nbsp;：${parseFloat(queryPoint[0].properties.tax).toLocaleString()}亿</h3>
    //       <h3>上年同期税收：${parseFloat(JSON.parse(queryPoint[0].properties.sshz).sntq).toLocaleString()}亿</h3>
    //       <h3>同比增减幅&nbsp;&nbsp;&nbsp;&nbsp;：${(JSON.parse(queryPoint[0].properties.sshz).tbzjf)}</h3>`;

    //       popup
    //         .setLngLat(coords as any)
    //         .setHTML(html)
    //         .addTo(this.map);
    //     }
    //   } else {
    //     // selectNsr = "";
    //     (this.map.getSource("grid-active") as any).setData(this.empty);
    //     this.map.getCanvas().style.cursor = "";
    //     popup.remove();
    //   }
    // });

    // // 行政区划下钻税收分析
    // this.map.on("click", e => {
    //   const coords = [e.lngLat.lng, e.lngLat.lat];
    //   // console.log(e);
    //   const queryPoint = this.map.queryRenderedFeatures(e.point, {
    //     layers: ["xzqh-extrusion"]
    //   });
    //   if (queryPoint.length) {
    //     this.map.setPaintProperty("grid-active", "fill-extrusion-height", {
    //       property: "tax",
    //       stops: [[0, 0], [this.maxTax, this.heightStop]]
    //     });
    //     this.gridActive.features = [queryPoint[0]];
    //     (this.map.getSource("grid-active") as any).setData(this.gridActive);
    //     this.map.getCanvas().style.cursor = "pointer";
    //     if (queryPoint[0].properties.xzqh_mc) {

    //       this.countyVisible = true;
    //       this.selectedXzqh.name = queryPoint[0].properties.xzqh_mc;
    //       this.selectedXzqh.bnd = parseFloat(queryPoint[0].properties.tax) as any;
    //       this.selectedXzqh.tbzje = parseFloat(JSON.parse(queryPoint[0].properties.sshz).sntq).toLocaleString();
    //       this.selectedXzqh.tbzjf = (JSON.parse(queryPoint[0].properties.sshz).tbzjf);
    //       this.getCountyTax(queryPoint[0].properties.xzqh_mc);
    //     }
    //   } else {
    //   }
    // });

    // 
    // this.initCyss();
    // this.initZsxmss();
    // this.initHyss();

  }


  addCityBoundary() {
    const $stream1 = this.http.get('assets/data/yt/SJ_Polygon.json');
    $stream1.subscribe(resp => {
      console.log(resp);

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


  // 初始化财政运行分析
  initCzyxfx() {
    // 判断是否存在行政区划数据数据源及图层
    if (this.map.getLayer('xzqh-extrusion')) {
      this.map.removeLayer('xzqh-extrusion');
    }
    if (this.map.getSource('xzqh-source')) {
      this.map.removeSource('xzqh-source')
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
    // forkJoin([]).subscribe(resp => {
    //   this.bndzss = resp[1].data.hz.bnd;
    //   this.tbzje = resp[1].data.hz.tzbjz;
    //   this.tbzjf = resp[1].data.hz.tbzjf;

    //   // 获取税收
    //   this.xzqhData = resp[1].data.data.sort(
    //     this.createCompareFunction("bnd")
    //   );
    //   this.initXzqhss(this.xzqhData);
    //   // console.log(resp);
    //   const taxArray = [];
    //   resp[0].features.forEach(feature => {
    //     resp[1].data.data.forEach(item => {
    //       if (item.xzqhmc == feature.properties.xzqh_mc) {
    //         Object.defineProperty(feature.properties, 'tax', {
    //           writable: true,
    //           configurable: true,
    //           enumerable: true,
    //           value: item.bnd
    //         });
    //         Object.defineProperty(feature.properties, 'sshz', {
    //           writable: true,
    //           configurable: true,
    //           enumerable: true,
    //           value: item
    //         });

    //         taxArray.push(feature.properties.tax);
    //       }
    //     });

    //   });
    //   const minTax = Math.min(...taxArray);
    //   const maxTax = Math.max(...taxArray);
    //   this.minTax = minTax;
    //   this.maxTax = maxTax;
    //   const fillColorStops = this.getRange(minTax, maxTax);

    //   this.map.addSource('xzqh-source', {
    //     'type': 'geojson',
    //     'data': resp[0] as any
    //   });
    //   this.map.addLayer({
    //     'id': 'xzqh-extrusion',
    //     'type': 'fill-extrusion',
    //     'source': "xzqh-source",
    //     'paint': {
    //       // "fill-extrusion-color": "hsl(55, 1%, 17%)",
    //       "fill-extrusion-color": {
    //         property: "tax",
    //         stops: fillColorStops
    //       },
    //       "fill-extrusion-height": {
    //         property: "tax",
    //         stops: [[0, 0], [maxTax, this.heightStop]]
    //       },
    //       "fill-extrusion-base": 0,
    //       "fill-extrusion-opacity": 0.85,
    //       "fill-extrusion-height-transition": {
    //         duration: 2000
    //       },
    //       "fill-extrusion-color-transition": {
    //         duration: 2000
    //       }
    //     }
    //   });
    // });
  }

  /**
   * 初始化产业税收
   */
  initCyss(xzqhmc?: string) {
    this.http.get('').subscribe(resp => {
      let seriesData;
      if (xzqhmc) {
        this.cyssData = resp.data.data.filter(item => item.xzqhmc === xzqhmc);
        seriesData = resp.data.data
          .filter(item => item.xzqhmc === xzqhmc)
          .map(item => {
            return {
              name: item.cymc,
              value: item.bnd
            }
          });
      } else {
        this.cyssData = resp.data.data;
        seriesData = resp.data.data.map(item => {
          return {
            name: item.cymc,
            value: item.bnd
          }
        });
      }

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
    this.http.get('').subscribe(resp => {
      const seriesData = [];
      const xAxisData = [];
      const sortedData = resp.data.data;

      if (xzqhmc) {
        sortedData
          .filter(item => item.xzqhmc === xzqhmc)
          .sort(order("bnd")).splice(0, 10)
          .forEach(item => {
            if (item.bnd != 0) {
              seriesData.push(item.bnd);
              xAxisData.push(item.mlmc);
            }
          });
      } else {
        sortedData.sort(order("bnd")).splice(0, 10).forEach(item => {
          if (item.bnd != 0) {
            seriesData.push(item.bnd);
            xAxisData.push(item.mlmc);
          }
        });
      }


      // sortedData.forEach(item => {
      //   if (item['bnd'] != 0) {
      //     seriesData.push(item['bnd']);
      //     xAxisData.push(item['mlmc']);
      //   }
      // });
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
    this.http.get('').subscribe(resp => {
      const seriesData = [];
      const xAxisData = [];
      const sortedData = resp.data.data;

      if (xzqhmc) {
        sortedData
          .filter(item => item.xzqhmc === xzqhmc)
          .sort(order("bnd"))
          .forEach(item => {
            if (item.bnd != 0) {
              seriesData.push(item.bnd);
              xAxisData.push(item.zsxmmc);
            }
          });
      } else {
        sortedData.sort(order("bnd")).forEach(item => {
          if (item.bnd != 0) {
            seriesData.push(item.bnd);
            xAxisData.push(item.zsxmmc);
          }
        });
      }
      // sortedData.forEach(item => {
      //   if (item['bnd'] != 0) {
      //     seriesData.push(item['bnd']);
      //     xAxisData.push(item['zsxmmc']);
      //   }
      // });
      this.zsxmChartOpt = {
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
          bottom: 57,
          left: "14%",
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

  initXzqhss(xzqhssData: any[]) {
    const seriesData = xzqhssData.filter(item => item.xzqhmc != "青岛市本级").map(item => {
      return {
        name: item.xzqhmc,
        value: item.bnd
      }
    });
    // 
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
  /**
   * 根据税收区间获取颜色填充
   * @param min ：最小税收
   * @param max ：最大税收
   */
  getRange(min, max) {
    console.log("min-max", min, max);
    const range = Math.abs(max - min);
    const arr = [];
    const data = parseInt((range / 5) as any);
    for (let i = 0; i < 6; i++) {
      arr.push([parseInt(min + data * i), this.colorStops[i]]);
    }
    return arr;
  }



  fly2target(center?, pitch?, zoom?, bearing?) {
    this.map.flyTo({
      center: [121.4099, 37.47522],
      zoom: 7.794791255081221,
      bearing: 0.70286,
      pitch: 40,
      speed: 0.8
    });
  }
}
