import { CompanyListEditComponent } from './../list/edit/edit.component';
import { CompanyListViewComponent } from './../list/view/view.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STReq, STRequestOptions, STRes, STData } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import * as dark from "../../geo/styles/dark.json";
import { NzMessageService } from 'ng-zorro-antd';
import * as mapboxgl from "mapbox-gl";
import { LoadingService } from '@delon/abc';

@Component({
  selector: 'app-company-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.less']
})
export class CompanyPositionComponent implements OnInit {

  //#region 地图相关参数
  style;
  center;
  zoom;
  map: mapboxgl.Map;
  nsrMarker: mapboxgl.Marker;
  nsrDefPosition;
  selected;
  //#endregion


  //#region ng-alain 表格
  @ViewChild('st', { static: false }) st: STComponent;
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
      title: '纳税人识别号',
      index: 'NSRSBH',
      width: 220,
      fixed: 'left',
      className: 'text-center'
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      width: 230,
      fixed: 'left',
      className: 'text-center'
    },
    {
      title: '社会信用代码',
      index: 'SHXYDM',
      width: 220,
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
      index: 'department_name',
      width: 160,
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
      width: 100,
      className: 'text-center'
    },

    {
      title: '登记日期',
      type: 'date',
      index: 'DJRQ',
      width: 100,
      dateFormat: 'YYYY-MM-DD',
      className: 'text-center'
    },
    {
      title: '修改日期',
      type: 'date',
      index: 'XGRQ',
      width: 100,
      dateFormat: 'YYYY-MM-DD',
      className: 'text-center'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
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
            const { NSRMC, ZCDZ } = _record;
            const params = ZCDZ ? { address: ZCDZ } : { address: NSRMC };

            this.http.get('geo/amap/geocode', params).subscribe(resp => {

              if (!resp.success) {
                this.msgSrv.error(resp.msg);
              }
              const center = {
                lat: resp.data.lat,
                lng: resp.data.lng
              };
              this.nsrDefPosition = center;
              if (resp.success) {
                this.map.flyTo({
                  center,
                  zoom: 16
                });
              }
              if (this.nsrMarker) {
                this.nsrMarker.setLngLat(center);
              } else {
                this.nsrMarker = new mapboxgl.Marker({ draggable: true });
                this.nsrMarker.setLngLat(center).addTo(this.map);
                this.nsrMarker.getElement().addEventListener("click", e => {
                  this.modal
                    .create(CompanyListViewComponent, { record: _record }, {
                      modalOptions: {
                        nzStyle: {
                          left: '26%',
                          position: 'fixed'
                        }
                      }
                    });
                });
              }

            });

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

  constructor(private http: _HttpClient,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService,
    private modal: ModalHelper) { }

  ngOnInit() {
    this.style = (dark as any).default;
    this.loadSrv.open();
  }

  /** mapbox gl load
   */
  mapboxglLoad(e) {
    this.map = e;
    this.loadSrv.close();
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
    this.map.flyTo({ center: this.nsrDefPosition, zoom: 16 });
  }

  mapresize(e) {
    console.log('resize:', e);
  }

}
