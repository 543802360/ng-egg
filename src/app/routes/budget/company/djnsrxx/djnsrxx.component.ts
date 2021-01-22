import { LoadingTypesService } from '@core';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STReq, STRes, STColumnTag, STPage, STRequestOptions, STChange } from '@delon/abc/st';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService, XlsxExportOptions, LoadingService, ReuseComponentInstance } from '@delon/abc';
import { CompanyDjnsrxxViewComponent } from './view/view.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CompanyDjnsrxxAddComponent } from './add/add.component';
import { CacheService } from '@delon/cache';
import { NzTreeNode } from "ng-zorro-antd/tree";
import { array2tree, COLORS, dateFormatter } from "@shared";
import { ArrayService, getTimeDistance } from "@delon/util";
import * as mapboxgl from "mapbox-gl";
import { dark_T as dark } from "@geo";


const MAPBOX_POS = {
  center: [120.8303991378192, 37.10038795930873],
  pitch: 40,
  bearing: -10.441292648171384,
  zoom: 8.056808924835703
}


@Component({
  selector: 'app-company-djnsrxx',
  templateUrl: './djnsrxx.component.html',
  styleUrls: ['./djnsrxx.component.less']
})


export class CompanyDjnsrxxComponent implements OnInit, AfterViewInit, ReuseComponentInstance {
  @ViewChild('st') st: STComponent;
  @ViewChild('scztSt') scztSt: STComponent;

  url = "nsr/list";
  scztUrl = 'nsr/countByDjzclx'
  selectedSwjg; //所选税务机关
  swjgNodes: NzTreeNode[] = []; //税务机关节点

  selectRangeDate = getTimeDistance('month'); //当前所选时间
  startDate = this.selectRangeDate[0];
  endDate = this.selectRangeDate[1];
  selectDjzclx; //所选登记注册类型
  selectDjzclx_map;
  djzclxNodes = [
    {
      label: '内资企业', value: 100
    },
    {
      label: '港、澳、台商投资企业', value: 200
    },
    {
      label: '外商投资企业', value: 300
    },
    {
      label: '个体经营', value: 400
    },
    {
      label: '非企业单位', value: 500
    },
    {
      label: '其他', value: 900
    }
  ]

  total: number;
  selectedRows: STData[] = [];
  nsrztTag: STColumnTag = {
    '正常': { text: '正常', color: 'green' },
    '报验': { text: '报验', color: 'blue' },
    '停业': { text: '停业', color: 'orange' },
    '注销': { text: '注销', color: 'red' },
    '非正常户注销': { text: '非正常户注销', color: 'red' },
    '非正常户': { text: '非正常', color: 'red' },
    '核销报验': { text: '核销报验', color: 'red' }

  };
  // 数据列配置
  columns: STColumn[] = [
    // {
    //   index: 'userid',
    //   title: '编号',
    //   type: 'checkbox',
    //   fixed: 'left',
    //   width: 40,
    //   exported: false,
    //   className: 'text-center'
    // },
    {
      title: '序号',
      type: 'no',
      fixed: 'left',
      width: 60,
      className: 'text-center'

    },
    {
      title: '纳税人识别号',
      index: 'NSRSBH',
      fixed: 'left',
      width: 180,
      className: 'text-center'
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      fixed: 'left',
      width: 250,
      className: 'text-center'
    },
    {
      title: '社会信用代码',
      index: 'SHXYDM',
      width: 180,
      className: 'text-center'
    },
    {
      title: '主管税务局',
      index: 'SWJGJC',
      width: 180,
      className: 'text-center'
    },
    {
      title: '税务所科分局',
      index: 'SWSKFJJC',
      width: 200,
      className: 'text-center'
    },
    // {
    //   title: '纳税人状态',
    //   index: 'NSRZTMC',
    //   width: 100,
    //   type: "tag",
    //   tag: this.nsrztTag,
    //   className: 'text-center'
    // },
    {
      title: '登记注册类型',
      index: 'DJZCLXMC',
      width: 150,
      className: 'text-center'
    },
    {
      title: '行业',
      // index: 'HY_DM',
      index: 'HYMC',
      width: 150,
      className: 'text-center'
    },
    {
      title: '生产经营地址',
      index: 'SCJYDZ',
      className: 'text-center'
    },
    {
      title: '注册地址',
      index: 'ZCDZ',
      className: 'text-center'
    },
    {
      title: '法定代表人',
      index: 'FDDBRXM',
      className: 'text-center',
      width: 120
    },
    {
      title: '录入日期',
      index: 'LRRQ',
      width: 110,
      className: 'text-center'
    },
    {
      title: '修改日期',
      type: 'date',
      index: 'XGRQ',
      dateFormat: 'yyyy-MM-dd',
      className: 'text-center',
      width: 120
    },
    {
      title: '登记日期',
      type: 'date',
      index: 'DJRQ',
      fixed: 'right',
      dateFormat: 'yyyy-MM-dd',
      className: 'text-center',
      width: 120
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      className: 'text-center',
      buttons: [
        {
          icon: 'eye',
          tooltip: '查看基本信息',
          type: 'modal',
          acl: {
            ability: ['company:djnsrxx:view']
          },
          modal: {
            component: CompanyDjnsrxxViewComponent,
            params: record => ({ record }),
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          //
          click: (_record, modal, comp) => {

          }
        },
        {
          icon: 'edit',
          acl: {
            ability: ['company:djnsrxx:confirm']
          },
          click: (record, _modal, comp) => {
            // modal 为回传值，可自定义回传值
            const { NSRMC } = record;
            const target = this.scztData.find(i => i.properties.nsrmc === NSRMC);
            const [LNG, LAT] = target.geometry.coordinates;
            this.router.navigate(['../position'], {
              queryParams: { nsrInfo: JSON.stringify(Object.assign(record, { LNG, LAT })) },
              relativeTo: this.route
            });
          },
        },
      ]
    }
  ];
  // 市场主体统计表头
  scztColumns: STColumn[] = [
    {
      title: '登记注册类型',
      index: 'DJZCLXMC',
      width: 150,
      className: 'text-center'
    },
    {
      title: '新办户数',
      index: 'COUNT',
      width: 80,
      className: 'text-center'
    }

  ];
  // 分页配置
  page: STPage = {
    showSize: true,
    pageSizes: [10, 20, 30, 40, 50, 100]
  };
  // 查询参数
  params = {
    swjg_dm: this.selectedSwjg ? this.selectedSwjg : '',
    startDate: this.startDate.toLocaleDateString(),
    endDate: this.endDate.toLocaleDateString(),
    djzclx_dm: this.selectDjzclx ? this.selectDjzclx : ''
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
      const { SWJG_DM } = requestOpt.params as any;
      if (SWJG_DM === null) {
        // (requestOpt.params as any).set('NSRMC', ['']);
        Object.defineProperty(requestOpt.params, 'SWJG_DM', {
          enumerable: true,
          configurable: true,
          value: ''
        })
      }
      return requestOpt;
    }
  };
  // 新办户数名录response 配置
  companyRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.count;
      return rawData.data.rows;
    }
  };
  //按市场主体统计 response 配置
  scztRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      return rawData.data;
    }
  };

  scztData: any[];
  XlsxExportOptions: XlsxExportOptions;

  //#region mapbox map

  style = dark;
  map: mapboxgl.Map;
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
  })

  //#endregion
  constructor(
    private arraySrv: ArrayService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private cacheSrv: CacheService,
    private msgSrv: NzMessageService,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private router: Router,
    private route: ActivatedRoute,
    private xlsx: XlsxService
  ) { }
  _onReuseDestroy: () => void;
  destroy: () => void;
  ngOnInit() {

    this.http.get('assets/data/yt/swjg_tree.json').subscribe(resp => {
      this.cacheSrv.set('swjg', resp);
      const swjgTmp = this.arraySrv.treeToArr(Object.values(resp));
      const swjgArray = swjgTmp.map(item => {
        return {
          title: item.label,
          key: item.id ? item.id : '',
          parent_id: item.parent ? item.parent.id : null,
          parent_name: item.parent ? item.parent.label : null,
        };
      });
      this.swjgNodes = array2tree(swjgArray, 'key', 'parent_id', 'children');
    });
  }
  /**
 * 复用路由初始化，重复进入时
 */
  _onReuseInit() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.st.load(1, this.params);
      this.scztSt.load(1, this.params);
    }, 100);
  }
  /**
   * 税务机关选择change
   */
  onSwjgChange(e) {
    this.params.swjg_dm = e;
  }
  /**
    * 登记注册类型选择change
    */
  onDjzclxChange(e) {
    this.params.djzclx_dm = e;
  }
  /**
   * 时间范围选择change
   * @param e 
   */
  onDateRangeChange(e: Date[]) {
    const [startDate, endDate] = e;
    this.params.startDate = startDate.toLocaleDateString();
    this.params.endDate = endDate.toLocaleDateString();

  }

  add() {
  }

  batchadd() {

    this.modal.create(CompanyDjnsrxxAddComponent, { i: null }, {
      size: 'lg',
      // modalOptions: {
      //   nzWidth: '600px',
      //   nzStyle: {
      //     left: '25%',
      //   }
      // }
    }).subscribe(resp => {
      const data = this.selectedRows.map(item => ({ ...item, ...resp }));
      this.loadingSrv.open({
        type: 'custom',
        custom: this.loadingTypeSrv.loadingTypes.Cubes,
        text: '正在处理……'
      });
      this.http.post('hx/nsr', data).subscribe(res => {
        this.loadingSrv.close();
        if (res.success) {
          this.msgSrv.success(res.msg);
        } else {
          this.msgSrv.error(res.msg);

        }
      });

    });
    // this.modalSrv.confirm({
    //   nzTitle: '提示',
    //   nzContent: '确认添加至本辖区企业库吗？',
    //   nzCancelText: '取消',
    //   nzOnOk: () => {
    //     this.loadingSrv.open({
    //       type: 'custom',
    //       custom: this.loadingTypeSrv.loadingTypes.Cubes,
    //       text: '正在处理……'
    //     });
    //     this.http.post('hx/nsr', this.selectedRows).subscribe(res => {
    //       this.loadingSrv.close();
    //       if (res.success) {
    //         this.msgSrv.success(res.msg);
    //       } else {
    //         this.msgSrv.error(res.msg);

    //       }
    //     });
    //   }
    // });

  }

  /**
   * 表格check事件
   * @param e
   */
  stChange(e: STChange) {
    if (e.type === 'click') {
      console.log(e);
      const { NSRMC } = e.click.item;
      const target = this.scztData.find(i => i.properties.nsrmc === NSRMC);
      const lnglat = target.geometry.coordinates;

      this.fly2target(lnglat, null, 16);

    }
  }
  /**
   * fly to target
   * @param center 
   * @param pitch 
   * @param zoom 
   * @param bearing 
   */
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
  // clear() {
  //   // 清除所有checkbox
  //   this.st.clearCheck();
  //   // 清除单选
  //   this.st.clearRadio();
  //   // 清除所有状态（单复选、排序、过滤）
  //   this.st.clearStatus();

  //   this.selectedRows = [];
  // }

  // /**
  //  * 重置表
  //  */
  // reset() {
  //   // this.params.NSRMC = '';
  //   // this.params.NSRSBH = '';
  //   this.st.reset(this.params);
  // }

  onChange(e) { }

  mapboxLoad(e) {
    this.map = e;
    // 添加税务机关边界线图
    this.http.get('assets/data/yt/SWJG.json').subscribe(resp => {
      if (!this.map.getSource('current_city_source')) {
        this.map.addSource('current_city_source', {
          type: 'geojson',
          data: resp as any
        });
      }
      if (!this.map.getLayer('current_city_line')) {
        (this.map as any).addLayer({
          "id": "current_city_line",
          "type": "line",
          "source": "current_city_source",
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

        (this.map as any).addLayer({
          "id": "current_city_fill",
          "type": "fill",
          "source": "current_city_source",
          "minzoom": 3,
          "maxzoom": 8.1,
          "paint": {
            'fill-color': 'black',
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
          }
        });

      }
      setTimeout(() => {
        this.initSymbolLayer();
      }, 100);

    });
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
        const { nsrmc, zcdz, djzclxmc, zgswj, djrq } = queryPt[0].properties;
        html = `<h5>纳税人名称：${nsrmc}</h5>
                <h5>市场主体类型：${djzclxmc}</h5>
                <h5>主管税务局:${zgswj}</h5>
                <h5>生产经营地址:${zcdz}</h5>
                <h5>登记日期：${djrq}</h5>`;
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
        const { nsrmc } = queryPt[0].properties;
        this.router.navigate(['../../single-query'], {
          queryParams: { nsrmc },
          relativeTo: this.route
        });
      }
    });
    // 添加市场主体点位
    this.http.get('assets/data/yt/sczt_new.json').subscribe(resp => {
      this.initDotLayer(resp);
      this.scztData = resp.features;

    });

  }

  initSymbolLayer() {
    this.http.get('assets/data/yt/swjg_point.json').subscribe(resp => {
      // 构造标注点geojson数据，赋值统计数据
      if (!this.map.getSource('swjg_point_source')) {
        this.map.addSource('swjg_point_source', {
          type: 'geojson',
          data: resp as any
        });
      };
      if (!this.map.getLayer('swjg_point_symbol')) {
        (this.map as any).addLayer({
          "id": "swjg_point_symbol",
          "type": "symbol",
          "source": "swjg_point_source",
          "minzoom": 3,
          "maxzoom": 8.10,
          'symbol-sort-key': 111,
          layout: {
            'text-field': '{NAME}',
            "text-font": ["微软雅黑"],
            'text-size': 16,
            'text-justify': 'center',
            'text-allow-overlap': true
          },
          paint: {
            'text-color': 'white',
            "text-halo-color": "black",
            "text-halo-blur": 1.5,
            "text-halo-width": 1,
          }
        });
      }
    });
  }


  //#region 初始化三种样式专题图

  /**
 * 初始化散点地图
 * @param data 
 */
  initDotLayer(scztGeojson) {

    if (this.map.getSource('dot-source')) {
      (this.map.getSource('dot-source') as mapboxgl.GeoJSONSource).setData(scztGeojson as any);
      (this.map.getSource('nsr') as mapboxgl.GeoJSONSource).setData(scztGeojson as any);

      return;
    }
    else {
      this.map.addSource('dot-source', {
        type: 'geojson',
        data: scztGeojson as any
      });

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
            stops: [[9, 4], [19, 20]]
          },
          "circle-color": 'red'
          ,
          "circle-opacity": 0.75
        }
      });
      this.initClusterLayer(scztGeojson);
      this.initHeatLayer();
    }
  }
  /**
   * 初始化热力图
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
        "minzoom": 3.101,
        'maxzoom': 14,
        'paint': {
          // Increase the heatmap weight based on frequency and property valuenitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3,
            0,
            7,
            0.8,
            16,
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
            4,
            14,
            20
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
    const value1 = ['<=', ['get', 'djzclxdm'], 100];
    const value2 = ['all', ['>', ['get', 'djzclxdm'], 100], ['<=', ['get', 'djzclxdm'], 200]];
    const value3 = ['all', ['>', ['get', 'djzclxdm'], 200], ['<=', ['get', 'djzclxdm'], 300]];
    const value4 = ['all', ['>', ['get', 'djzclxdm'], 300], ['<=', ['get', 'djzclxdm'], 400]];
    const value5 = ['all', ['>', ['get', 'djzclxdm'], 400], ['<=', ['get', 'djzclxdm'], 500]];
    const value6 = ['>', ['get', 'djzclxdm'], 500];

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
        'value5': ['+', ['case', value5, 1, 0]],
        'value6': ['+', ['case', value6, 1, 0]]

      }
    });
    // circle and symbol layers for rendering individual nsr (unclustered points)
    this.map.addLayer({
      'id': 'nsr_circle',
      'type': 'circle',
      'source': 'nsr',
      "minzoom": 6.101,
      'filter': ['!=', 'cluster', true],
      layout: {
        visibility: 'none'
      },
      'paint': {
        'circle-color': [
          'case',
          value1,
          colors[8],
          value2,
          colors[6],
          value3,
          colors[4],
          value4,
          colors[3],
          value5,
          colors[2],
          value6,
          colors[1],
          colors[0],
        ],
        'circle-opacity': 0.6,
        'circle-radius': 12
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

  //#endregion

  /**
   * 切换散点、聚合、热力等图层
   * @param e 
   */
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
        this.map.setLayerZoomRange('dot-layer', 6.101, 20);
        this.map.setLayoutProperty('dot-layer', 'visibility', 'visible');
        this.map.setLayoutProperty('nsr_circle', 'visibility', 'none');
        this.map.setLayoutProperty('nsr_label', 'visibility', 'none');
        setTimeout(() => {
          this.map.resize();
        }, 100);
        break;

      case 'cluster':
        this.map.setLayoutProperty('heat-layer', 'visibility', 'none');
        this.map.setLayerZoomRange('dot-layer', 6.101, 20);
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

  filterLayer(e) {

    const filter = ['all', ['>=', ['get', 'djzclxdm'], e], ['<', ['get', 'djzclxdm'], e + 100]];

    // this.map.setFilter('')
    this.map.setFilter('heat-layer', filter);
    this.map.setFilter('dot-layer', filter);
    this.map.setFilter('dot-layer', filter);
    this.map.setFilter('nsr_circle', filter);
    this.map.setFilter('nsr_label', filter);
  }

  // 时间轴播放新增效果


}
