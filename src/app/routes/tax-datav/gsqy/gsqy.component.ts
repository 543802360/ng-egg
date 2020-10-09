import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { dark_T as dark, decimal_T as decimal } from '@geo';
import { TaxDataVService } from './../tax-data-v.service';

import { forkJoin } from 'rxjs';
import * as mapboxgl from "mapbox-gl";
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { COLORS, ColorTypes, getColorRange, order, Point } from '@shared';
import { LoadingService } from '@delon/abc';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '@delon/cache';
/**
 * 结果数据接口
 */
interface ItemData {
  NSRMC: string,
  BNDSR: number,
  SNTQ: number,
  TBZJZ: number,
  TBZJF: string,
  lat: number,
  lng: number
}
// 税收分级次item接口
interface gsqyItem {
  DJZCLX_DM: string,
  DJZCLX_MC: string,
  HY_MC: string,
  HZRQ: string,
  NSRMC: string,
  NSRSBH: string,
  ROW_ID: number,
  SE_CCS: number,
  SE_CJS: number,
  SE_CZTDSYS: number,
  SE_FCS: number,
  SE_GDZYS: number,
  SE_GRSDS: number,
  SE_HJ: number,
  SE_HJBHS: number,
  SE_QS: number,
  SE_QTSS: number,
  SE_QYSDS: number,
  SE_SX: number,
  SE_TDZZS: number,
  SE_XFS: number,
  SE_YHS: number,
  SE_ZYS: number,
  SE_ZZS: number,
  SWJG_MC: string,
}

// mapbox pos参数
const MAPBOX_POS = {
  center: [120.657985, 37.24082995331422],
  pitch: 60,
  bearing: -10.441292648171384,
  zoom: 7.899747984494937
}

@Component({
  selector: 'app-tax-datav-gsqy',
  templateUrl: './gsqy.component.html',
  styleUrls: ['./gsqy.component.scss']
})
export class TaxDatavGsqyComponent implements OnInit, AfterViewInit {

  url = `analysis/taxdot`;

  selectedValue = 50; // 所选纳税金额
  selectedHy; // 所选行业
  resData: ItemData[];

  count = 0;
  totalValue = 0;
  tbzjValue = 0;
  tbzjf = '';

  //#region  规上企业变量、参数

  gsqyUrl = "/gsqy";
  gsqyData: gsqyItem[] = [];
  totalItem = {};
  gsqyCount;
  gsqyCount_BL;
  gsqyTaxValue;
  gsqyTaxValue_BL;

  // 规上企业行业税收
  gsqyHyObj = {};
  gsqySwjgObj = {};
  //#endregion

  //#region 图表

  // 纳税规模
  nsgmChartOpt;
  nsgmChart;
  // 按行业分析
  gsqyHyChartOpt;
  gsqyHyChart;
  // 税务机关分析
  gsqySwjgChartOpt;
  gsqySwjgChart;

  //#endregion

  style = dark;
  map: mapboxgl.Map;// map 
  heightStop = 20000;
  pointActive = {
    type: 'FeatureCollection',
    features: []
  }
  empty = {
    type: 'FeatureCollection',
    features: []
  }
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'top'
  });
  colorActive = "yellow";

  constructor(public http: _HttpClient,
    private cacheSrv: CacheService,
    private loadSrv: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public taxDataVSrv: TaxDataVService) {

  }
  _onReuseDestroy: () => void;
  destroy: () => void;
  ngOnInit() {
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.taxDataVSrv.title = '规上企业分布图';
    });
  }

  /**
   * 
   * @param e mapbox map loaded event
   */
  mapboxLoad(e) {
    this.map = e;
    (window as any).map = this.map;
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

    this.initGsqy();
    this.fly2target();
    // 地图样式切换事件监听,切换后续重新加载原专题数据
    this.map.on('styledata', styleData => {

      this.addCityBoundary();
      if (!this.map.getLayer('heat-layer')) {
        setTimeout(() => {
          this.getData();
        });
      }

      if (!this.map.getSource('point-active')) {
        // 添加高亮数据源
        this.map.addSource('point-active', {
          type: 'geojson',
          data: this.pointActive as any
        });
        this.map.addLayer({
          id: 'point-active',
          type: 'circle',
          source: 'point-active',
          layout: {
            visibility: 'visible'
          },
          paint: {
            "circle-radius": 30,
            // "circle-radius": {
            //   stops: [[9, 4], [19, 22]]
            // },
            "circle-color": '#ffc300',
            "circle-opacity": 0.8,
            "circle-blur": 0.8
          }

        });
      }
    });
    this.getData();
    // 添加高亮数据源
    this.map.addSource('point-active', {
      type: 'geojson',
      data: this.pointActive as any
    });
    this.map.addLayer({
      id: 'point-active',
      type: 'circle',
      source: 'point-active',
      layout: {
        visibility: 'visible'
      },
      paint: {
        "circle-radius": 30,
        // "circle-radius": {
        //   stops: [[9, 4], [19, 22]]
        // },
        "circle-color": '#ffc300',
        "circle-opacity": 0.8,
        "circle-blur": 0.8
      }

    });
    // 注册鼠标移动事件
    this.map.on('mousemove', e => {
      let html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        this.pointActive.features = [queryPt[0]];
        (this.map.getSource('point-active') as any).setData(this.pointActive);
        console.log(this.pointActive);
        this.map.getCanvas().style.cursor = 'point';
        const { nsrmc, value } = queryPt[0].properties;
        html = `<h5>纳税人名称：${nsrmc}</h5>
        <h5>本年度纳税额：${value}万元</h5>`;
        this.popup.setLngLat([lng, lat]).setHTML(html).addTo(this.map);
      } else {
        (this.map.getSource('point-active') as any).setData(this.empty);
        this.map.getCanvas().style.cursor = '';
        this.popup.remove();
      }
    });
    this.map.on('mouseleave', e => {
      this.popup.remove();
    });
    this.map.on('click', e => {
      console.log(e);
      const html = '';
      const { lng, lat } = e.lngLat;
      const queryPt = this.map.queryRenderedFeatures(e.point, {
        layers: ['dot-layer', 'nsr_circle']
      });
      if (queryPt.length) {
        const { nsrmc, value } = queryPt[0].properties;
        this.router.navigate(['../../budget/single-query'], {
          queryParams: { nsrmc },
          relativeTo: this.route
        });
      }
    });

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
   * 初始化规模以上企业数据
   */
  initGsqy() {

    this.http.post(this.gsqyUrl, {}).subscribe(resp => {
      // console.table(resp.rows.splice(0, 10));
      const gsqyData: gsqyItem[] = resp.rows;
      this.gsqyData = gsqyData.sort(order('SE_HJ')).splice(0, 20);
      // 计算总数及比例
      this.gsqyCount = gsqyData.length;
      this.gsqyCount_BL = 2.3;
      this.gsqyTaxValue = gsqyData.map(i => i.SE_HJ).reduce((x, y) => x + y);
      const totalTaxValue = this.cacheSrv.get('totalTax', { mode: 'none' });
      this.gsqyTaxValue_BL = Math.floor(this.gsqyTaxValue / totalTaxValue.SE_HJ_BQ * 10000) / 100


      //#region 计算规上企业纳税规模
      // 计算纳税规模
      let QWYS_COUNT = 0;
      let WBW_QW_COUNT = 0;
      let LBW_WBW_COUNT = 0;
      let YBW_LBW_COUNT = 0;
      let YBWYX_COUNT = 0;

      gsqyData.forEach(i => {

        i.SE_HJ > 1000 ? ++QWYS_COUNT :
          i.SE_HJ > 500 ? ++WBW_QW_COUNT :
            i.SE_HJ > 200 ? ++LBW_WBW_COUNT :
              i.SE_HJ > 100 ? ++YBW_LBW_COUNT :
                ++YBWYX_COUNT;

      });

      const nsgmPieData = [
        {
          name: '千万以上',
          value: QWYS_COUNT
        },
        {
          name: '五百万至千万',
          value: WBW_QW_COUNT
        },
        {
          name: '两百万至五百万',
          value: LBW_WBW_COUNT
        },
        {
          name: '一百万至两百万',
          value: YBW_LBW_COUNT
        },
        {
          name: '一百万以下',
          value: YBWYX_COUNT
        }
      ];

      this.initGsqyNsgmChart(nsgmPieData);
      //#endregion


      //#region 计算规上企业行业分类

      gsqyData.forEach(i => {
        const HY_MC = i.HY_MC.trim();
        const hyExisted = Object.keys(this.gsqyHyObj).includes(HY_MC);
        if (hyExisted) {
          this.gsqyHyObj[HY_MC].items.push(i.SE_HJ);
          this.gsqyHyObj[HY_MC].total = this.gsqyHyObj[HY_MC].total + i.SE_HJ;

        } else {
          this.gsqyHyObj[HY_MC] = {
            total: i.SE_HJ,
            items: [i.SE_HJ]
          };
        }
      });
      // 按总额排序
      const values = Object.values(this.gsqyHyObj).sort(order('total'));
      const newHyObj = {};
      for (let i = 0; i < values.length; i++) {
        Object.keys(this.gsqyHyObj).map(item => {
          if (this.gsqyHyObj[item].total === (values[i] as any).total) {
            newHyObj[item] = values[i];
          }
        });

      }

      const gsqyHySeriesData = Object.values(newHyObj).splice(0, 10).map(i => {
        return Math.floor((i as any).total * 100) / 100
      });
      const gsqyHyAxisData = Object.keys(newHyObj).splice(0, 10);
      this.initGsqyHyChart(gsqyHySeriesData, gsqyHyAxisData);

      //#endregion

      //#region 计算规上企业税务机关分类

      gsqyData.forEach(i => {
        let SWJG_MC = i.SWJG_MC.trim();
        SWJG_MC = SWJG_MC.substr(6, SWJG_MC.length - 1);
        SWJG_MC = SWJG_MC.substr(0, SWJG_MC.search('税务局'));
        const swjgExisted = Object.keys(this.gsqySwjgObj).includes(SWJG_MC);
        if (swjgExisted) {
          this.gsqySwjgObj[SWJG_MC].items.push(i.SE_HJ);
          this.gsqySwjgObj[SWJG_MC].total = this.gsqySwjgObj[SWJG_MC].total + i.SE_HJ;

        } else {
          this.gsqySwjgObj[SWJG_MC] = {
            total: i.SE_HJ,
            items: [i.SE_HJ]
          };
        }
      });
      // 按总额排序
      const swjg_values = Object.values(this.gsqySwjgObj).sort(order('total'));
      const newSwjgObj = {};
      for (let i = 0; i < swjg_values.length; i++) {
        Object.keys(this.gsqySwjgObj).map(item => {
          if (this.gsqySwjgObj[item].total === (swjg_values[i] as any).total) {
            newSwjgObj[item] = swjg_values[i];
          }
        });

      }

      // const gsqySwjgSeriesData = Object.values(newSwjgObj).splice(0, 10).map(i => {
      //   return Math.floor((i as any).total * 100) / 100
      // });
      // const gsqySwjgAxisData = Object.keys(newSwjgObj).splice(0, 10);
      console.log('=======newSwjgObj=======');
      console.table(newSwjgObj);

      const gsqySwjgSeriesData = Object.entries(newSwjgObj).map(i => {
        return {
          name: i[0],
          value: Math.floor((i[1] as any).total * 100) / 100
        }
      });

      // console.log(gsqySwjgSeriesData);
      this.initGsqySwjgChart(gsqySwjgSeriesData);

      //#endregion


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
      toolbox: {
        show: true,
        feature: {

          saveAsImage: {}
        }
      },
      series: [
        {
          name: '纳税规模',
          type: 'pie',
          radius: ['22%', '45%'],
          minAngle: 20,
          avoidLabelOverlap: true,
          label: {
            formatter: '{b}\n{c}户 ({d}%)',
            color: (params) => {
              // 自定义颜色
              const colorList = COLORS.primary;
              //  [
              //   'rgb(33,107,198)',
              //   'rgb(82,182,96)',
              //   'rgb(70,162,136)',
              //   'rgb(192,47,36)',
              //   'rgb(240,157,40)'
              // ];
              // console.log(params, colorList[params.dataIndex]);
              return colorList[params.dataIndex]
            }
          },
          itemStyle: {
            normal: {
              color: (params) => {
                // 自定义颜色
                const colorList = COLORS.primary;
                // [
                //   'rgb(33,107,198)',
                //   'rgb(82,182,96)',
                //   'rgb(70,162,136)',
                //   'rgb(192,47,36)',
                //   'rgb(240,157,40)'
                // ];
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
   * 初始化规上企业按行业分析图表
   * @param seriesData 
   * @param xAxisData 
   */
  initGsqyHyChart(seriesData, xAxisData) {
    this.gsqyHyChartOpt = {
      backgroundColor: "transparent",
      title: {
        subtext: '单位：万元',
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
        left: "28%",
        right: "4%"
      },
      xAxis: {
        type: "value",
        axisLine: { onZero: false },
        nameRotate: 0.1,// 使用这个属性
        nameLoaction: "center",
      },

      yAxis: [{
        nameTextStyle: {
          fontSize: 14
        },
        axisLabel: {
          interval: 0,
          // margin: 95,
          textStyle: {
            fontSize: 13
            // align: 'left',
            // baseline: 'middle'
          },
          formatter(value) {
            if (value.length > 7) {
              return value.substring(0, 7) + "..";
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
                const colorList = COLORS.primary;
                //  [
                //   'rgb(33,107,198)', 'rgb(57,153,219)', 'rgb(82,182,96)'
                //   , 'rgb(92,206,115)', 'rgb(70,162,136)', 'rgb(86,201,171)', 'rgb(192,47,36)', 'rgb(228,75,57)'
                //   , 'rgb(240,157,40)', 'rgb(217,178,35)'
                // ].reverse();
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };
  }

  initGsqySwjgChart(seriesData) {

    this.gsqySwjgChartOpt = {
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
          // radius: '70%',
          radius: ['30%', '55%'],
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            normal: {
              color(params) {
                // 自定义颜色
                const colorList = COLORS.info;
                // [
                //   'rgb(33,107,198)', 'rgb(57,153,219)', 'rgb(82,182,96)'
                //   , 'rgb(92,206,115)', 'rgb(70,162,136)', 'rgb(86,201,171)', 'rgb(192,47,36)', 'rgb(228,75,57)'
                //   , 'rgb(240,157,40)', 'rgb(217,178,35)'
                // ];
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

  fly2target() {
    this.map.flyTo({
      center: MAPBOX_POS.center as any,
      zoom: MAPBOX_POS.zoom,
      bearing: MAPBOX_POS.bearing,
      pitch: MAPBOX_POS.pitch,
      speed: 0.8
    });
  }


  /**
   * 查询数据
   */
  getData() {
    this.count = 0;
    this.totalValue = 0;
    this.tbzjValue = 0;
    this.tbzjf = '';
    let sntqValue = 0;
    this.loadSrv.open({ text: '正在处理……' });
    this.http.get(this.url, this.getCondition()).subscribe(resp => {

      this.loadSrv.close();
      this.count = resp.data.length;
      resp.data.forEach(i => {
        this.totalValue += i.BNDSR;
        sntqValue += i.SNTQ;
      });
      this.tbzjValue = this.totalValue - sntqValue;
      this.tbzjf = `${(Math.floor(this.tbzjValue / sntqValue * 10000) / 100).toFixed(2)}%`;
      this.resData = [...resp.data];

      this.initDotLayer(resp.data);
      this.cdr.detectChanges();

    });
  }

  /**
   * 获取查询条件参数
   */
  getCondition() {
    // this.bdgSelect.budgetValue.length == 0 ? this.bdgSelect.budgetValue = [4] : null;
    // const { startDate, endDate } = this.monthRange;
    // const year = startDate.getFullYear();
    // const startMonth = startDate.getMonth() + 1;
    // const endMonth = endDate.getMonth() + 1;
    // const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    // const value = this.selectedValue;

    // const adminCode = '3302130000';
    // return this.selectedHy === null ? { year, startMonth, endMonth, budgetValue, value }
    //   : { year, startMonth, endMonth, budgetValue, value, ...this.selectedHy };

    return {
      year: 2020,
      startMonth: 1,
      endMonth: 9,
      budgetValue: 4,
      value: 50,
    }

  }

  /**
   * 初始化散点地图
   * @param data 
   */
  initDotLayer(data) {

    const values = data.map(i => i.BNDSR);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // 构造点集合
    const features = data.map((i, index) => {
      return Point(i.lat, i.lng, {
        nsrmc: i.NSRMC,
        value: i.BNDSR
      })
    });
    const fc = {
      type: 'FeatureCollection',
      features
    };


    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as mapboxgl.GeoJSONSource).setData(fc as any);
      (this.map.getSource('nsr') as mapboxgl.GeoJSONSource).setData(fc as any);

      return;
    }
    else {
      this.map.addSource('dot-source', {
        type: 'geojson',
        data: fc as any
      });
      const colorStops = getColorRange(min, max, ColorTypes.success)
      this.map.addLayer({
        id: 'dot-layer',
        type: 'circle',
        minzoom: 12.61,
        source: 'dot-source',
        layout: {
          visibility: 'visible'
        },
        paint: {
          "circle-radius": {
            stops: [[9, 3], [19, 15]]
          },
          "circle-color": {
            property: 'value',
            stops: [
              [0, COLORS.danger[0]],
              [10, COLORS.danger[1]],
              [50, COLORS.danger[2]],
              [100, COLORS.danger[3]],
              [200, COLORS.danger[4]],
              [500, COLORS.danger[5]],
              [800, COLORS.danger[6]],
              [1000, COLORS.danger[7]],
              [5000, COLORS.danger[8]]
            ]
          },
          "circle-opacity": 0.85
        }
      });
      this.initClusterLayer(fc);
      this.initHeatLayer();
    }


  }

  /**
   * 初始化散点图
   * @param data 
   */
  initHeatLayer() {
    if (this.map.getLayer('heat-layer')) {
      return;
    }
    this.map.addLayer(
      {
        'id': 'heat-layer',
        'type': 'heatmap',
        'source': 'dot-source',
        'maxzoom': 14,
        'paint': {
          // Increase the heatmap weight based on frequency and property valuenitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            10,
            0,
            1000,
            1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            19,
            5
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            6,
            14,
            30
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            12,
            1,
            15,
            0
          ]
        }
      }
    );
  }

  initClusterLayer(data) {

    const that = this;
    const value1 = ['<', ['get', 'value'], 50];
    const value2 = ['all', ['>=', ['get', 'value'], 50], ['<', ['get', 'value'], 100]];
    const value3 = ['all', ['>=', ['get', 'value'], 100], ['<', ['get', 'value'], 500]];
    const value4 = ['all', ['>=', ['get', 'value'], 500], ['<', ['get', 'value'], 1000]];
    const value5 = ['>=', ['get', 'value'], 1000];

    // colors to use for the categories
    const colors = COLORS.danger   // add a clustered GeoJSON source for a sample set of nsr

    if (this.map.getSource('nsr')) {
      (this.map.getSource('nsr') as any).setData(data);
      return;
    }

    this.map.addSource('nsr', {
      'type': 'geojson',
      'data': data,
      'cluster': true,
      'clusterRadius': 60,
      'clusterProperties': {
        // keep separate counts for each valuenitude category in a cluster
        'value1': ['+', ['case', value1, 1, 0]],
        'value2': ['+', ['case', value2, 1, 0]],
        'value3': ['+', ['case', value3, 1, 0]],
        'value4': ['+', ['case', value4, 1, 0]],
        'value5': ['+', ['case', value5, 1, 0]]
      }
    });
    // circle and symbol layers for rendering individual nsr (unclustered points)
    this.map.addLayer({
      'id': 'nsr_circle',
      'type': 'circle',
      'source': 'nsr',
      'filter': ['!=', 'cluster', true],
      layout: {
        visibility: 'none'
      },
      'paint': {
        'circle-color': [
          'case',
          value1,
          colors[0],
          value2,
          colors[2],
          value3,
          colors[4],
          value4,
          colors[6],
          colors[8]
        ],
        'circle-opacity': 0.6,
        'circle-radius': 12
      }
    });
    this.map.addLayer({
      'id': 'nsr_label',
      'type': 'symbol',
      'source': 'nsr',
      'filter': ['!=', 'cluster', true],
      'layout': {
        'text-field': '{value}',
        'text-font': ['微软雅黑'],
        'text-size': {
          stops: [
            [9, 12],
            [14, 15],
            [19, 20]
          ]
        },
        visibility: 'none'
      },
      'paint': {
        'text-halo-color': 'gray',
        'text-halo-width': 1,
        'text-color': '#ffc300'
      }
    });

    // objects for caching and keeping track of HTML marker objects (for performance)
    const markers = {};
    let markersOnScreen = {};

    function updateMarkers() {
      const newMarkers = {};
      const features = that.map.querySourceFeatures('nsr');

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (let i = 0; i < features.length; i++) {
        const coords = (features[i].geometry as any).coordinates;
        const props = features[i].properties;
        if (!props.cluster) continue;
        const id = props.cluster_id;

        let marker = markers[id];
        if (!marker) {
          const el = that.createDonutChart(props);
          marker = markers[id] = new mapboxgl.Marker(el as HTMLElement).setLngLat(coords);
        }
        newMarkers[id] = marker;

        if (!markersOnScreen[id]) marker.addTo(that.map);
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (const id in markersOnScreen) {
        if (!newMarkers[id]) markersOnScreen[id].remove();
      }
      markersOnScreen = newMarkers;
    }

    // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
    this.map.on('data', e => {
      if (e.sourceId !== 'nsr' || !e.isSourceLoaded) return;
      this.map.on('move', updateMarkers);
      this.map.on('moveend', updateMarkers);
      updateMarkers();
    });
  }
  // code for creating an SVG donut chart from feature properties
  createDonutChart(props) {
    const offsets = [];
    const counts = [
      props.value1,
      props.value2,
      props.value3,
      props.value4,
      props.value5
    ];
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
      offsets.push(total);
      total += counts[i];
    }
    const fontSize =
      total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
    const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    let html =
      '<div><svg width="' +
      w +
      '" height="' +
      w +
      '" viewbox="0 0 ' +
      w +
      ' ' +
      w +
      '" text-anchor="middle" style="font: ' +
      fontSize +
      'px sans-serif; display: block">';

    for (let i = 0; i < counts.length; i++) {
      html += this.donutSegment(
        offsets[i] / total,
        (offsets[i] + counts[i]) / total,
        r,
        r0,
        COLORS.danger[i]
      );
    }
    html +=
      '<circle cx="' +
      r +
      '" cy="' +
      r +
      '" r="' +
      r0 +
      '" fill="white" /><text dominant-baseline="central" transform="translate(' +
      r +
      ', ' +
      r +
      ')">' +
      total.toLocaleString() +
      '</text></svg></div>';

    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
  }

  donutSegment(start, end, r, r0, color) {
    if (end - start === 1) end -= 0.00001;
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
      y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
      y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

    return [
      '<path d="M',
      r + r0 * x0,
      r + r0 * y0,
      'L',
      r + r * x0,
      r + r * y0,
      'A',
      r,
      r,
      0,
      largeArc,
      1,
      r + r * x1,
      r + r * y1,
      'L',
      r + r0 * x1,
      r + r0 * y1,
      'A',
      r0,
      r0,
      0,
      largeArc,
      0,
      r + r0 * x0,
      r + r0 * y0,
      '" fill="' + color + '" />'
    ].join(' ');
  }
  switchLayer(e) {
    switch (e) {
      case 'heat':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'visible');
        this.map.setLayerZoomRange('dot-layer', 12.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;
      case 'dot':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;

      case 'cluster':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 3.61, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'visible');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;

      default:
        break;
    }
  }
}


