import { filter, switchMap, debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STReq, STRes, STColumnTag, STPage, STRequestOptions, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { XlsxService, LoadingService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IDjnsrxx } from '@shared';
import { NzModalService, UploadChangeParam } from 'ng-zorro-antd';
import { CompanyListViewComponent } from './view/view.component';
import { CompanyListEditComponent } from './edit/edit.component';
@Component({
  selector: 'app-company-list',
  templateUrl: './list.component.html',
})
export class CompanyListComponent implements OnInit {
  @ViewChild('st') st: STComponent;
  url = "hx/nsr/list";
  upload = 'hx/nsr/upload';
  total: number;
  nsrmcAutoDataSource = [];
  nsrsbhAutoDataSource = [];
  searchAutoChangeS = new Subject<any>();

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
      format: (item, col, index) => `${index + 1} `,
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
      width: 230,
      className: 'text-center'
    },
    {
      title: '社会信用代码',
      index: 'SHXYDM',
      className: 'text-center'
    },
    {
      title: '税收留存比例',
      index: 'SSFC',
      className: 'text-center',
      width: 120,
      format: (item, col, index) => `${item.SSFC}%`

    },
    {
      title: '所属街道',
      width: 100,
      index: 'department_name',
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
  //
  batchDelDisabled = true;
  constructor(
    public http: _HttpClient,
    public loadSrv: LoadingService,
    public modal: ModalHelper,
    public modalSrv: NzModalService,
    public msgSrv: NzMessageService,
  ) { }

  ngOnInit() {
    // 搜索提示自动完成框;字符长度大于2、延迟500ms发送请求
    let suggestionKey = '';
    this.searchAutoChangeS
      .pipe(
        filter(resp => {
          return Object.values(resp)[0] && (Object.values(resp)[0] as any).length >= 2
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
    this.modal
      .createStatic(CompanyListEditComponent, { record: null }, {
        modalOptions: {
          nzStyle: {
            left: '26%',
            position: 'fixed'
          }
        }
      })
      .subscribe(res => {
        if (res) {
          this.st.reload();
        }
      });
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
        const dels = this.selectedRows.map(item => item.UUID);
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

  export() {
    this.st.export(true, { filename: '纳税人信息.xlsx', sheetname: 'sheet1' })
  }

  /**
   * 表格change
   * @param e
   */
  stChange(e: STChange) {
    if (e.type === 'checkbox') {
      e.checkbox.length ? this.batchDelDisabled = false : this.batchDelDisabled = true;
      // console.log(e.checkbox);
      this.selectedRows = e.checkbox as any;
    }

  }

  beforeUpload = (file: File) => {

    if (file.name.includes('xls') || file.name.includes('xlsx')) {
      return true;
    } else {
      this.msgSrv.error('只支持excel文件上传！');
      return false;
    }
  };

  /**
   * 上传excel事件
   * @param e
   */
  uploadChange(e: UploadChangeParam) {
    // console.log(e);
    if (e.type === "success") {

      e.file.response.success ? this.msgSrv.success(e.file.response.msg) : this.msgSrv.error(e.file.error);
      this.st.reload();
      return;
    }
    if (e.type === "error") {
      this.msgSrv.error(e.file.error);
    }
  }
}
