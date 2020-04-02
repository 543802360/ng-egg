import { filter, switchMap, debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STReq, STRes, STColumnTag, STPage, STRequestOptions, STChange } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { XlsxService, XlsxExportOptions, LoadingService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IDjnsrxx } from '@shared';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-company-list',
  templateUrl: './list.component.html',
})
export class CompanyListComponent implements OnInit {
  @ViewChild('st', { static: false }) st: STComponent;
  url = "hx/nsr/list";
  total: number;
  nsrmcAutoDataSource = [];
  nsrsbhAutoDataSource = [];
  searchAutoChangeS = new Subject<string>();

  importTypes = ['下载模板', '追加导入'];
  selectedRows: IDjnsrxx[] = [];
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
      width: 100,
      className: 'text-center'
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      fixed: 'left',
      width: 230,
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
      width: 140,
      className: 'text-center',
      buttons: [
        {
          // text: '查看',
          icon: 'eye',
          tooltip: '查看纳税人信息',
          acl: {
            ability: ['company:hxnsrxx:view']
          },
          click: (item: any) => `/form/${item.id}`
        },
        {
          icon: 'edit',
          tooltip: '编辑纳税人信息',
          acl: {
            ability: ['company:hxnsrxx:edit']
          },
          type: 'static',
        },
        {
          icon: 'delete',
          tooltip: '删除',
          type: 'del',
          acl: {
            ability: ['company:hxnsrxx:delete']
          },
          click: (record, _modal, comp) => {
            this.http.post('hx/nsr/del', [record.DJXH]).subscribe(resp => {
              if (resp.success) {
                this.msgSrv.success(`${resp.msg}`);
                comp!.removeRow(record);
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
  XlsxExportOptions: XlsxExportOptions;
  //
  batchDelDisabled = true;
  constructor(
    private http: _HttpClient,
    private loadSrv: LoadingService,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
    private xlsx: XlsxService
  ) { }

  ngOnInit() {
    // 搜索提示自动完成框;字符长度大于2、延迟500ms发送请求
    let suggestionKey = '';
    this.searchAutoChangeS
      .pipe(
        filter(resp => {
          return Object.values(resp)[0] && Object.values(resp)[0].length >= 2
        }),
        debounceTime(500),
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



  /**
   * 批量删除
   */
  batchDel() {
    this.modalSrv.warning({
      nzTitle: '提示',
      nzContent: '确定从本辖区移除这些企业吗？',
      nzOnOk: () => {
        this.loadSrv.open({ text: '正在处理……' });
        const dels = this.selectedRows.map(item => item.DJXH);
        this.http.post('hx/nsr/del', dels).subscribe(res => {
          this.loadSrv.close();
          this.batchDelDisabled = true;
          if (res.success) {
            this.msgSrv.success(res.msg);
            this.st.reload();
          } else {
            this.msgSrv.error(res.msg);
          }
        }, error => {
          this.loadSrv.close();
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {

      }
    })
  }

  /**
   * 清除所选
   */
  clear() {
    // 清除所有checkbox
    this.st.clearCheck();
    // 清除单选
    this.st.clearRadio();
    // 清除所有状态（单复选、排序、过滤）
    this.st.clearStatus();
    this.selectedRows.length = 0;
  }
  /**
   * 重置表格
   */
  reset() {
    this.params.NSRMC = '';
    this.params.NSRSBH = '';
    this.st.reset(this.params);
  }

  stChange(e: STChange) {
    if (e.type === 'checkbox') {
      e.checkbox.length ? this.batchDelDisabled = false : this.batchDelDisabled = true;
      // console.log(e.checkbox);
      this.selectedRows = e.checkbox as any;
    }

  }


  /**
   * 导出纳税人信息
   */
  exportNsrData() {
    const data = [this.columns.filter(i => i.title !== '操作' && i.title !== '序号' && i.title !== '编号').map(i => i.title)];
    this.st._data.forEach(i =>
      data.push(this.columns.map(c => i[c.index as string])),
    );
    this.xlsx.export({
      sheets: [
        {
          data,
          name: '数据',
        },
      ],
      filename: '纳税人登记信息.xlsx'
    });
  }

}
