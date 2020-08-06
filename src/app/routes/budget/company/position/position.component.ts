import { LoadingTypesService } from '@core';
import { CompanyListEditComponent } from './../list/edit/edit.component';
import { CompanyListViewComponent } from './../list/view/view.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRequestOptions, STRes, STData, STChange } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd';
import { LoadingService } from '@delon/abc';

// import * as L from "leaflet";


@Component({
  selector: 'app-company-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.less']
})
export class CompanyPositionComponent implements OnInit, AfterViewInit {

  //#region 地图相关参数
  center;
  // 纳税人位置marker
  nsrMarker;
  // 纳税人默认坐标
  nsrDefPosition;
  // 当前所选纳税人
  selected;
  // 纳税人位置可编辑图层
  editableLayer = L.featureGroup();
  // leafletMap: L.Map;
  leafletMap;


  //#endregion


  //#region ng-alain 表格
  @ViewChild('st') st: STComponent;
  url = "hx/nsr/list";
  total: number;
  expandForm = false;
  // 数据列配置
  columns: STColumn[] = [
    {
      title: '序号',
      type: 'no',
      width: 70,
      fixed: 'left',
      className: 'text-center'
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      width: 245,
      fixed: 'left',
      className: 'text-center'
    },
    {
      title: '纳税人识别号',
      index: 'NSRSBH',
      width: 210,
      className: 'text-center'
    },

    {
      title: '社会信用代码',
      index: 'SHXYDM',
      width: 210,
      className: 'text-center'
    },
    {
      title: '税收留存比例',
      index: 'SSFC',
      width: 120,
      className: 'text-center',
      format: (item, col, index) => `${item.SSFC}%`

    },
    {
      title: '所属街道',
      index: 'JDXZMC',
      width: 120,
      className: 'text-center',
      // 超管可见
      acl: {
        role: ['1']
      }
    },
    {
      title: '有效标志',
      index: 'YXBZ',
      width: 100,
      className: 'text-center',
      // 超管可见
      acl: {
        role: ['1']
      },
      type: "tag",
      tag: {
        'Y': { text: '有效', color: 'green' },
        'N': { text: '无效', color: 'red' },
      },
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
      width: 130,
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
      title: '注册地址',
      index: 'ZCDZ',
      width: 260,
      className: 'text-center'
    },
    {
      title: '联系人',
      index: 'LXR',
      width: 100,
      className: 'text-center'
    },
    {
      title: '联系电话',
      index: 'LXDH',
      width: 110,
      className: 'text-center'
    },

    {
      title: '登记日期',
      type: 'date',
      index: 'DJRQ',
      width: 120,
      dateFormat: 'yyyy-MM-dd',
      className: 'text-center'
    },
    {
      title: '修改日期',
      type: 'date',
      index: 'XGRQ',
      width: 120,
      dateFormat: 'yyyy-MM-dd',
      className: 'text-center'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      className: 'text-center',
      buttons: [
        {
          // text: '查看',
          icon: 'eye',
          tooltip: '查看纳税人信息',
          type: 'modal',
          acl: {
            ability: ['company:hxnsrxx:view']
          },
          modal: {
            component: CompanyListViewComponent,
            params: record => ({ record }),
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          click: (_record, modal, comp) => {
            // modal 为回传值，可自定义回传值

          }
        },
        {
          icon: 'edit',
          tooltip: '编辑纳税人信息',
          acl: {
            ability: ['company:hxnsrxx:edit']
          },
          type: "modal",
          modal: {
            component: CompanyListEditComponent,
            params: record => record,
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          click: (_record, modal, comp) => {
            // modal 为回传值，可自定义回传值

          }
        },
        {
          icon: 'global',
          tooltip: '定位',
          acl: {
            ability: ['company:hxnsrxx:edit']
          },
          type: "none",
          click: (_record) => {

            // console.log(_record);
            this.selected = _record;
            const { DJXH, NSRMC, ZCDZ, NSRSBH, DJZCLXMC, HYMC, LXR, LXDH, JDXZMC, LAT, LNG } = _record;

            this.leafletMap.flyTo([LAT, LNG], 7);
            this.editableLayer.eachLayer(layer => {
              if (layer.DJXH === DJXH) {
                setTimeout(() => {
                  layer.openPopup();
                });
              }
            });

            // const params = ZCDZ ? { address: ZCDZ } : { address: NSRMC };
            // const popupContent = `
            // <h5>纳税人名称：${NSRMC}</h5>
            // <h5>纳税人识别号：${NSRSBH}</h5>
            // <h5>登记注册类型：${DJZCLXMC}</h5>
            // <h5>所属行业：${HYMC}</h5>
            // <h5>所属街道：${JDXZMC}</h5>
            // <h5>联系人：${LXR}</h5>
            // <h5>联系电话：${LXDH}</h5>
            // <h5>注册地址：${ZCDZ}</h5>
            // `;
            // this.http.get('geo/amap/geocode', params).subscribe(resp => {

            //   if (!resp.success) {
            //     this.msgSrv.error(resp.msg);
            //   }
            //   const center = {
            //     lat: resp.data.lat,
            //     lng: resp.data.lng
            //   };
            //   this.nsrDefPosition = center;
            //   if (resp.success) {
            //     this.leafletMap.flyTo([center.lat, center.lng], 7);
            //   }
            //   if (this.nsrMarker) {
            //     // L.marker([center.lat,center.lng]).
            //     this.nsrMarker.setLatLng([center.lat, center.lng]).bindPopup(popupContent, { maxWidth: 600 });

            //   } else {

            //     this.nsrMarker = L.marker([center.lat, center.lng]).addTo(this.leafletMap).bindPopup(popupContent, { maxWidth: 600 });
            //     this.editableLayer.addLayer(this.nsrMarker);
            //   }

            // });

          }
        },
        {
          icon: 'delete',
          tooltip: '删除',
          type: 'del',
          acl: {
            ability: ['company:hxnsrxx:delete']
          },
          click: (record, _modal, comp) => {
            this.http.post('hx/nsr/del', [record.UUID]).subscribe(resp => {
              if (resp.success) {
                this.msgSrv.success(`${resp.msg}`);
                comp!.removeRow(record);
                this.st.reload();
              }
              else {
                this.msgSrv.error(resp.msg);
              };
            });

          },
        },
      ]
    }
  ];
  page: STPage = {
    showSize: true,
    pageSizes: [10, 20, 30, 40, 50, 100]
  };
  params = {
    NSRMC: '',
    NSRSBH: '',
    SHXYDM: ''
  }
  // 请求配置
  companyReq: STReq = {
    type: 'page',
    method: 'GET',
    reName: {
      pi: 'pageNum',
      ps: 'pageSize'
    },
    process: (requestOpt: STRequestOptions) => {
      const { NSRMC, NSRSBH } = requestOpt.params as any;
      if (NSRMC === null) {
        // (requestOpt.params as any).set('NSRMC', ['']);
        Object.defineProperty(requestOpt.params, 'NSRMC', {
          enumerable: true,
          configurable: true,
          value: ''
        })
      }
      if (NSRSBH === null) {
        // (requestOpt.params as any).set('NSRSBH', ['']);
        Object.defineProperty(requestOpt.params, 'NSRSBH', {
          enumerable: true,
          configurable: true,
          value: ''
        })
      }
      return requestOpt;
    }
  };
  // response 配置
  companyRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.count;
      return rawData.data.rows;
    }
  };
  //#endregion

  constructor(public http: _HttpClient,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private msgSrv: NzMessageService,
  ) { }

  ngOnInit() {
    this.loadingSrv.open({
      type: 'custom',
      custom: this.loadingTypeSrv.loadingTypes.Cubes
    });
  }

  ngAfterViewInit() {
  }

  /**
   *
   * @param e
   */
  mapboxglLoad(e) {

    const { map } = e
    this.leafletMap = map;
    this.loadingSrv.close();
    //#region 添加draw 控件

    //#endregion
    this.leafletMap.addLayer(this.editableLayer);
    const defaultDrawOptions = {
      position: 'topleft',
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.editableLayer,
        remove: false
      }
    };
    const drawCtrl = new L.Control.Draw(defaultDrawOptions);
    this.leafletMap.addControl(drawCtrl);

    this.leafletMap.on(L.Draw.Event.CREATED, e => {
      const type = e.layerType;
      const layer = e.layer;

      if (type === 'marker') {
      }

      this.editableLayer.addLayer(layer);
    });

    this.leafletMap.on('draw:edited', e => {
      const layers = e.layers;
      layers.eachLayer(layer => {
        // console.log(layer);
        const latlng = layer.getLatLng();
        const property = {
          ...layer.property,
          LAT: latlng.lat,
          LNG: latlng.lng
        }
        // 更新
        this.http.put(`hx/nsr/${property.UUID}`, property).subscribe(res => {
          this.msgSrv.success(res.msg);
        });

      });
    });


  }

  /** 确认位置
   */
  confirmPos() {
    const { lat, lng } = this.nsrMarker.getLngLat();
    // 更新
    this.http.put(`hx/nsr/${this.selected.UUID}`, { ...this.selected, LNG: lng, LAT: lat }).subscribe(res => {
      if (res.success) {
        this.msgSrv.success(res.msg);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  /** 重置位置
   */
  resetPos() {
    this.nsrMarker.setLngLat(this.nsrDefPosition);
    // this.mapboxMap.flyTo({ center: this.nsrDefPosition, zoom: 16 });
  }

  onStChange(e: STChange) {
    if (e.loaded) {
      this.editableLayer.clearLayers();
      e.loaded.forEach(item => {
        const { NSRMC, ZCDZ, NSRSBH, DJZCLXMC, HYMC, LXR, LXDH, JDXZMC, LAT, LNG } = item;

        const popupContent = `
        <h5>纳税人名称：${NSRMC}</h5>
        <h5>纳税人识别号：${NSRSBH}</h5>
        <h5>登记注册类型：${DJZCLXMC}</h5>
        <h5>所属行业：${HYMC}</h5>
        <h5>所属街道：${JDXZMC}</h5>
        <h5>联系人：${LXR}</h5>
        <h5>联系电话：${LXDH}</h5>
        <h5>注册地址：${ZCDZ}</h5>
        `;
        // const marker = L.marker([LAT, LNG]).bindPopup(popupContent).addTo(this.editableLayer);

        const marker = L.marker([LAT, LNG], {
          icon: L.BeautifyIcon.icon({
            icon: 'building',
            // iconSize: [28, 28],
            // isAlphaNumericIcon: true,
            iconShape: 'marker',
            borderColor: '#00ABCD',
            textColor: 'red'
          })
        }).bindPopup(popupContent).addTo(this.editableLayer);

        Object.defineProperty(marker, 'property', {
          value: item,
          enumerable: true
        });
      })
    }
  }

}
