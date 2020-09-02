import { Component, OnInit, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { LoadingService } from '@delon/abc';
import { LoadingTypesService } from '@core';
// import { PERM } from 'src/app/dictionary/PERM';


import { order, PERM } from '@shared';
import { map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-permu-tax-perm-datav',
  templateUrl: './perm-datav.component.html',
  styleUrls: ['./perm-datav.component.less']
})
export class PermuTaxPermDatavComponent implements OnInit, AfterViewInit {
  // pagehost，获取host元素，当屏幕缩放时，自适应
  @ViewChild("pageHost", { static: true }) pageHost: any;
  @ViewChild("totalQypmHost") totalQypmHost: any;
  //#region 地图相关参数
  style;
  center;
  zoom;
  map: mapboxgl.Map;

  mapboxOptions = {
    center: [120.3, 36.45],
    zoom: 8.8
  };

  filter = 0;
  //#endregion

  isFullScreen = false;
  // 按总额企业排名
  permOrderData: any[] = [];

  // 蓝色系--淡蓝
  colors = [
    "#094D4A",
    "#146968",
    "#1D7F7E",
    "#289899",
    "#34B6B7",
    "#4AC5AF",
    "#5FD3A6",
    "#7BE39E",
    "#A1EDB8",
    "#C3F9CC",
    "#DEFAC0",
    "#ECFFB1"
  ].reverse();
  // 饼图颜色-4色
  pieDataVColors = [
    "rgb(145,86,223)",
    "rgb(59,154,209)",
    "rgb(187,52,116)",
    "rgb(237,162,94)"
  ];
  heatColors = [
    "#FF3417",
    "#FF7412",
    "#FFB02A",
    "#FFE754",
    "#46F3FF",
    "#02BEFF",
    "#1A7AFF",
    "#0A1FB2"
  ];
  heatColors2 = [
    "#FF4818",
    "#F7B74A",
    "#FFF598",
    "#FF40F3",
    "#9415FF",
    "#421EB2"
  ];

  //#region 图表
  permAreaMlmcChartOpt;
  permTaxMlmcChartOpt;
  permScatterChartOpt;

  permScaleData;
  permScaleChartOpt;
  //#endregion
  constructor(
    private render2: Renderer2,
    private http: _HttpClient,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.loadingSrv.open({
      type: 'custom',
      custom: this.loadingTypeSrv.loadingTypes.Cubes
    });

    this.permScaleData = {
      "data": {
        "<=0": 289,
        "0-10": 2518,
        "10-100": 547,
        "100-500": 98,
        ">500": 30
      },
      "success": true
    }
  }

  ngAfterViewInit() {
    // this.mapboxSrv.Map.on('load', e => {
    //   this.map = this.mapboxSrv.Map;
    //   this.initPermMap();
    //   this.initPermOrder();
    //   this.initPermByMlmc();
    //   this.drawPermScatterChart();
    // });

    window.addEventListener("resize", e => {
      const { clientHeight, clientWidth } = this.pageHost.nativeElement;
      const { innerWidth, innerHeight } = window;
      const widthScale = innerWidth / clientWidth;
      const heightScale = innerHeight / clientHeight;
      if (innerWidth > 1980) {
        return;
      }
      if (widthScale > heightScale) {
        this.render2.setStyle(this.pageHost.nativeElement, "transform", `scale(${heightScale},${heightScale})`);

        if (innerWidth < 850) {
          this.render2.setStyle(this.pageHost.nativeElement, "left", `0px`);
          this.render2.setStyle(this.pageHost.nativeElement, "top", `${(innerHeight - clientHeight * heightScale) / 2}px`);

        } else {
          this.render2.setStyle(this.pageHost.nativeElement, "left", `${(innerWidth - clientWidth * heightScale) / 2}px`);
          this.render2.setStyle(this.pageHost.nativeElement, "top", `${(innerHeight - clientHeight * heightScale) / 2}px`);

        }

      } else {
        this.render2.setStyle(this.pageHost.nativeElement, "transform", `scale(${widthScale},${widthScale})`);
        if (innerWidth < 850) {
          this.render2.setStyle(this.pageHost.nativeElement, "left", `0px`);
          this.render2.setStyle(this.pageHost.nativeElement, "top", `${(innerHeight - clientHeight * widthScale) / 2}px`);

        } else {
          this.render2.setStyle(this.pageHost.nativeElement, "left", `${(innerWidth - clientWidth * widthScale) / 2}px`);
          this.render2.setStyle(this.pageHost.nativeElement, "top", `${(innerHeight - clientHeight * widthScale) / 2}px`);

        }
      }



    });
    // 初始化resize事件
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));

    });
  }

  /**
   * 全屏
   * @param e
   */
  fullScreen(e) {

    const element = document.documentElement;

    if (this.isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
        this.isFullScreen = true;
      }
    }

  }

  /**
   * 初始化亩均地图
   */
  initPermMap() {
    this.http.get('perm/all').subscribe(resp => {
      this.loadingSrv.close();
      this.initJtqyNsgm();
      this.map.flyTo({
        center: [120.44105743994783, 36.38193748780279],
        pitch: 60,
        bearing: 13.599,
        maxDuration: 4,
        zoom: 14,
        speed: 1,
        essential: true
      });

      this.map.addSource("permSource", {
        type: "geojson",
        data: resp.data
      });

      // extrusion
      // this.map.addLayer({
      //   id: "perm_3d_layer",
      //   type: "fill-extrusion",
      //   source: "permSource",
      //   layout: {
      //     visibility: "visible"
      //   },
      //   paint: {
      //     "fill-extrusion-color":
      //     {
      //       property: "perm_all",
      //       stops: [
      //         [0, this.colors[0]],
      //         [10, this.colors[1]],
      //         [25, this.colors[2]],
      //         [50, this.colors[3]],
      //         [100, this.colors[4]],
      //         [200, this.colors[5]],
      //         [500, this.colors[6]],
      //         [1000, this.colors[7]],
      //       ]
      //     },
      //     "fill-extrusion-height":
      //     {
      //       property: "perm_all",
      //       stops: [[10, 10], [1000, 1000]]
      //     },
      //     "fill-extrusion-color-transition": {
      //       duration: 2000
      //     },
      //     "fill-extrusion-height-transition": {
      //       duration: 2000
      //     },
      //     "fill-extrusion-opacity": 0.9
      //   }
      // });
      // 添加2d亩均图层
      // fill - color': [
      // 'interpolate',
      //   ['cubic-bezier', 0, 0.5, 1, 0.5],
      //   ['get', 'DEPTH'],
      //   200,
      //   '#78bced',
      //   9000,
      //   '#15659f'
      //      ]
      this.map.addLayer({
        id: 'perm_2d_layer',
        type: 'fill',
        source: 'permSource',
        paint: {
          "fill-color": {
            property: "perm_all",
            stops: [
              [0, this.colors[0]],
              [10, this.colors[1]],
              [25, this.colors[2]],
              [50, this.colors[3]],
              [100, this.colors[4]],
              [200, this.colors[5]],
              [500, this.colors[6]],
              [1000, this.colors[7]],
            ]
          },
          "fill-opacity": 0.7
        }
      });
      // 添加标注
      this.map.addLayer({
        "id": "perm_label",
        "type": "symbol",
        "source": "permSource",
        "minzoom": 12,
        "maxzoom": 20,
        "layout": {
          "text-size": {
            "base": 1,
            "stops": [
              [5, 14],
              [8, 18]
            ]
          },
          "text-font": ["微软雅黑"],
          "text-offset": [0, 0],
          "text-anchor": "center",
          // "text-field": "{nsrmc}",
          "text-field": ["format",
            ['get', 'nsrmc'], { "font-scale": 0.9 },
            '\n',
            '\n',
            // "亩均税收：", { "font-scale": 0.8 },
            ['get', 'perm_all'], { "font-scale": 0.8 }
          ],
          "text-padding": 50,
          "text-max-width": 20
        },
        "paint": {
          "text-color": "rgb(255, 255, 255)",
          // "text-halo-color": " rgb(203, 74, 240)",
          "text-halo-color": 'rgb(60, 130, 255)',
          "text-halo-blur": 1,
          "text-halo-width": 1,
          "text-translate": [0, 0]
        }
      });
      // 点击
      this.map.on('click', 'perm_2d_layer', e => {
        console.log('mouseenter', e, e.features);

        let info = '';
        if (e.features.length) {
          const feature = e.features[0];
          Object.keys(PERM).forEach(el => {
            info += `<h5>${PERM[el]}：${feature.properties[el]}</h5>`
          });

          new mapboxgl.Popup().setHTML(info).setLngLat(e.lngLat).addTo(this.map);
        }

      });

    });

  }


  /**
   * 初始化亩均税收排名数据
   */
  initPermOrder() {
    this.http.get('perm/order').subscribe(resp => {
      this.permOrderData = resp.data;
    });
    let loop = 0;
    // 设置向上滚动动画
    setTimeout(() => {
      this.render2.setStyle(this.totalQypmHost.nativeElement, "transition", `transform 0.6s linear 0s`);
    }, 600);

    setInterval(() => {
      ++loop;
      if (loop < 4) {
        this.render2.setStyle(this.totalQypmHost.nativeElement, "transform", `translate3d(0.001px, -${this.totalQypmHost.nativeElement.clientHeight * loop}px, 0.001px)`);
      } else {
        this.render2.setStyle(this.totalQypmHost.nativeElement, "transform", `translate3d(0.001px, 0px, 0.001px)`);
        loop = 0;
      }

    }, 5000);
  }

  initPermByMlmc() {
    this.http.get('perm/mlmc').subscribe(resp => {

      //#region 行业占地情况
      const zymjSort = resp.data.sort(order('zymj_mu')).reverse();
      const axisArray = zymjSort.map(item => item.MLMC);
      const zymjArray = zymjSort.map(item => item.zymj_mu);

      this.drawPermAreaMlmcChart(axisArray, zymjArray);
      //#endregion

      //#region 行业亩均税收情况
      const taxSort = resp.data.sort(order('perm_all_avg')).reverse();
      const axisArray1 = zymjSort.map(item => item.MLMC);
      const taxArray = zymjSort.map(item => item.perm_all_avg);

      this.drawPermTaxMlmcChart(axisArray1, taxArray);
      //#endregion

    });
  }

  initJtqyNsgm() {

    const seriesData = Object.keys(this.permScaleData.data).map(key => {
      return { value: this.permScaleData.data[key], name: key }
    });

    this.permScaleChartOpt = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: '亩均税收规模',
          type: "pie",
          radius: ["35%", "50%"],
          center: ["50%", "50%"],
          minAngle: 20,
          avoidLabelOverlap: true,
          label: {
            formatter: '{b}\n{c}户 ({d}%)',
            // color: (params) => {
            //   //自定义颜色
            //   let color_list = [
            //     'rgb(33,107,198)', 'rgb(57,153,219)', 'rgb(82,182,96)'
            //     , 'rgb(92,206,115)', 'rgb(70,162,136)', 'rgb(86,201,171)', 'rgb(192,47,36)', 'rgb(228,75,57)'
            //     , 'rgb(240,157,40)', 'rgb(217,178,35)'
            //   ];
            //   console.log(params, color_list[params.dataIndex]);
            //   return color_list[params.dataIndex];
            // }
          },
          itemStyle: {
            normal: {
              color: (params) => {
                // 自定义颜色
                const colorList = [
                  'rgb(33,107,198)',
                  'rgb(82,182,96)',
                  'rgb(70,162,136)',
                  'rgb(192,47,36)',
                  'rgb(240,157,40)'
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

  /**
   * 行业占地情况
   * @param axisData
   * @param seriesData
   */
  drawPermAreaMlmcChart(axisData: any[], seriesData: any[]) {
    this.permAreaMlmcChartOpt = {
      background: "transparent",
      color: ["#30C7C4"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "6%",
        right: "4%",
        bottom: "3%",
        top: "2%",
        containLabel: true
      },
      xAxis: {
        show: false,
        type: "value",
        axisLabel: {
          color: "white",
          fontSize: 14,
          textShadowColor: "rgb(65, 202, 255)",
          textShadowBlur: 4
        },
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        axisLabel: {
          interval: 0,
          color: "white",
          fontSize: 14,
          textShadowColor: "rgb(65, 202, 255)",
          textShadowBlur: 2,
          formatter: val => {
            return val.length > 6 ? `${val.substring(0, 6)}..` : val
          }
        },
        data: axisData
      },
      series: [
        {
          type: "bar",
          barGap: "50%",
          barCategoryGap: "60%",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0, color: "rgb(106,140,247)" // 0% 处的颜色
              }, {
                offset: 1, color: "rgb(208,57,254)" // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          data: seriesData
        }
      ],
      dataZoom: {
        type: 'slider', // 滑动条
        show: true,      // 开启
        yAxisIndex: [0],
        right: 18,  // 滑动条位置
        start: 50,    // 初始化时，滑动条宽度开始标度
        end: 100      // 初始化时，滑动条宽度结束标度<br>
      }
    };
  }

  /**
   * 行业亩均税收情况
   * @param axisData
   * @param seriesData
   */
  drawPermTaxMlmcChart(axisData: any[], seriesData: any[]) {
    this.permTaxMlmcChartOpt = {
      background: "transparent",
      color: ["#30C7C4"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "10%",
        right: "4%",
        bottom: "3%",
        top: "2%",
        containLabel: true
      },
      xAxis: {
        show: false,
        type: "value",
        axisLabel: {
          color: "white",
          fontSize: 14,
          textShadowColor: "rgb(65, 202, 255)",
          textShadowBlur: 4
        },
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        axisLabel: {
          color: "white",
          fontSize: 14,
          textShadowColor: "rgb(65, 202, 255)",
          textShadowBlur: 2,
          formatter: val => {
            return val.length > 6 ? `${val.substring(0, 6)}..` : val
          }
        },
        data: axisData
      },
      series: [
        {
          type: "bar",
          barGap: "50%",
          barCategoryGap: "60%",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0, color: "rgb(174,52,242)" // 0% 处的颜色
              }, {
                offset: 1, color: "rgb(224,45,111)" // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          data: seriesData
        }
      ],
      dataZoom: {
        type: 'slider', // 滑动条
        show: true,      // 开启
        yAxisIndex: [0],
        right: 18,  // 滑动条位置
        start: 50,    // 初始化时，滑动条宽度开始标度
        end: 100      // 初始化时，滑动条宽度结束标度<br>
      }
    };
  }

  drawPermScatterChart() {

    this.http.get('perm/scatter').subscribe(resp => {

      //#region 散点相关图

      const scatterData = resp.data.map(item => {
        const { ZYMJ_MU, ALL_VALUE } = item;
        return [ZYMJ_MU, ALL_VALUE];
      });
      console.log('散点相关图：', scatterData);
      this.permScatterChartOpt = {
        title: {
          text: 'Linear Regression',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
        },
        yAxis: {
          type: 'value',
          min: 1.5,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
        },
        series: [{
          name: 'scatter',
          type: 'scatter',
          emphasis: {
            label: {
              show: true,
              position: 'left',
              color: 'blue',
              fontSize: 16
            }
          },
          data: scatterData
        }]
      };
      //#endregion
    });


  }
  /**
   * 单个企业点击飞行
   * @param item
   */
  permItemClick(item) {
    console.log(item);
    this.http.get('perm/info', { nsrsbh: item.NSRSBH }).pipe(switchMap(resp =>
      this.http.get('perm/center', { polygon: JSON.stringify(resp.data[0].geom) })
    ))
      .subscribe(res => {
        console.log('center:', res);
        this.map.flyTo({
          center: res.center,
          zoom: 19
        })
      })
  }
  filterPerm() {
    console.log(this.filter);
    this.map.setFilter('perm_2d_layer', ['>=', ['get', 'perm_all'], this.filter]);
    this.map.setFilter('perm_3d_layer', ['>=', ['get', 'perm_all'], this.filter])

  }
}
