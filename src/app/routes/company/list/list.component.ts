import { filter, switchMap, debounceTime, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STReq, STRes, STColumnTag, STPage } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { XlsxService, XlsxExportOptions } from '@delon/abc';

@Component({
  selector: 'app-company-list',
  templateUrl: './list.component.html',
})
export class CompanyListComponent implements OnInit {
  @ViewChild('st', { static: false }) st: STComponent;
  url = "nsr/list";
  total: number;
  nsrmcAutoDataSource = [];
  nsrsbhAutoDataSource = [];
  searchAutoChangeS = new Subject<string>();

  importTypes = ['下载模板', '追加导入', '重新导入'];
  q = {
    NSRMC: '',
    NSRSBH: '',
    SHXYDM: '',
    NSRZT: ''
  };
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
        { text: '查看', click: (item: any) => `/form/${item.id}` },
        { text: '编辑', type: 'static', },
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
    params: this.params
  };
  // response 配置
  companyRes: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.count;
      return rawData.data.rows;
    }
  };
  XlsxExportOptions: XlsxExportOptions;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private xlsx: XlsxService
  ) { }

  ngOnInit() {
    // 搜索提示自动完成框
    let suggestionKey = '';
    this.searchAutoChangeS
      .pipe(
        debounceTime(400),
        filter(resp => Object.values(resp)[0].length >= 2))
      .pipe(switchMap(res => {
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

  /**
   *
   * @param e
   */
  searchAutoModelChange(e) {
    console.log(e);

  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

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
