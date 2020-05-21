import { LoadingTypesService } from '@core/loading-types.service';
import { CompanyDjnsrxxEditComponent } from './edit/edit.component';


import { filter, switchMap, debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STReq, STRes, STColumnTag, STPage, STRequestOptions, STChange } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { Subject } from 'rxjs';
import { XlsxService, XlsxExportOptions, LoadingService } from '@delon/abc';
import { CompanyDjnsrxxViewComponent } from './view/view.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd';
import { CompanyDjnsrxxAddComponent } from './add/add.component';

@Component({
  selector: 'app-company-djnsrxx',
  templateUrl: './djnsrxx.component.html',
})
export class CompanyDjnsrxxComponent implements OnInit {
  @ViewChild('st', { static: false }) st: STComponent;
  url = "nsr/list";
  total: number;
  nsrmcAutoDataSource = [];
  nsrsbhAutoDataSource = [];
  searchAutoChangeS = new Subject<any>();
  selectedRows: STData[] = [];
  expandForm = false;
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
    {
      index: 'userid',
      title: '编号',
      type: 'checkbox',
      fixed: 'left',
      width: 40,
      exported: false,
      className: 'text-center'
    },
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
      width: 220,
      className: 'text-center'
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      fixed: 'left',
      width: 220,
      className: 'text-center'
    },
    {
      title: '社会信用代码',
      index: 'SHXYDM',
      className: 'text-center'
    },
    {
      title: '纳税人状态',
      index: 'NSRZTMC',
      width: 100,
      type: "tag",
      tag: this.nsrztTag,
      className: 'text-center'
    },
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
    // {
    //   title: '经营范围',
    //   // index: 'HY_DM',
    //   index: 'JYFW',
    //   className: 'text-center'
    // },
    {
      title: '注册地址',
      index: 'ZCDZ',
      className: 'text-center'
    },
    {
      title: '联系人',
      index: 'LXR',
      className: 'text-center'
    },
    {
      title: '联系电话',
      index: 'LXDH',
      className: 'text-center'
    },

    {
      title: '登记日期',
      type: 'date',
      index: 'DJRQ',
      dateFormat: 'YYYY-MM-DD',
      className: 'text-center'
    },
    {
      title: '修改日期',
      type: 'date',
      index: 'XGRQ',
      dateFormat: 'YYYY-MM-DD',
      className: 'text-center'
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
            // modal 为回传值，可自定义回传值

          }
        },
        {
          icon: 'check-circle',
          tooltip: '选择企业',
          type: 'modal',
          acl: {
            ability: ['company:djnsrxx:confirm']
          },
          modal: {
            component: CompanyDjnsrxxEditComponent,
            params: record => ({ record }),
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          click: (record, _modal, comp) => {
            // this.http.post('sys/user/destroy', [record.userid]).subscribe(resp => {
            //   if (resp.success) {
            //     this.msgSrv.success(`成功删除用户${record.username}`);
            //     comp!.removeRow(record);
            //   }
            //   else {
            //     this.msgSrv.error(resp.msg);
            //   };
            // });

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
    NSRSBH: ''
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
  XlsxExportOptions: XlsxExportOptions;

  //
  batchDisabled = true;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
    private loadingSrv: LoadingService,
    private loadingTypeSrv: LoadingTypesService,
    private xlsx: XlsxService
  ) { }

  ngOnInit() {
    // 搜索提示自动完成框
    let suggestionKey = '';
    this.searchAutoChangeS
      .pipe(
        filter(resp => {
          return Object.values(resp)[0] && (Object.values(resp)[0] as any).length >= 2
        }),
        debounceTime(400),
        switchMap(res => {
          suggestionKey = Object.keys(res)[0];
          return this.http.get('nsr/suggestion', res)
        }))
      .subscribe(resp => {
        switch (suggestionKey) {
          case 'NSRMC':
            this.nsrmcAutoDataSource = resp.data;
            break;
          case 'NSRSBH':
            this.nsrsbhAutoDataSource = resp.data;
            break;
          case 'SHXYDM':

            break;

          default:
            break;
        }
      });
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
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
    if (e.type === 'checkbox') {
      e.checkbox.length ? this.batchDisabled = false : this.batchDisabled = true;
      // console.log(e.checkbox);
      this.selectedRows = e.checkbox;
    }
  }

  clear() {
    // 清除所有checkbox
    this.st.clearCheck();
    // 清除单选
    this.st.clearRadio();
    // 清除所有状态（单复选、排序、过滤）
    this.st.clearStatus();

    this.selectedRows = [];
  }

  /**
   * 重置表
   */
  reset() {
    this.params.NSRMC = '';
    this.params.NSRSBH = '';
    this.st.reset(this.params);
  }
  // exportNsrData() {
  //   const data = [this.columns.filter(i => i.title !== '操作' && i.title !== '序号' && i.title !== '编号').map(i => i.title)];
  //   this.st._data.forEach(i =>
  //     data.push(this.columns.map(c => i[c.index as string])),
  //   );
  //   this.xlsx.export({
  //     sheets: [
  //       {
  //         data,
  //         name: '数据',
  //       },
  //     ],
  //     filename: '纳税人登记信息.xlsx'
  //   });
  // }

}
