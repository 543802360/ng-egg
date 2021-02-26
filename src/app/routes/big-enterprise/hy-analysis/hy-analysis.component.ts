
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STChange, STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { MonthRangeComponent } from '@shared';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService, LoadingService, ReuseComponentInstance, OnboardingService } from '@delon/abc';

/**
 * 结果数据接口
 */
interface ItemData {
  MLMC?: string,
  COUNT?: number,
  SNTQ_QKJ_ALL?: number,
  BNDSR_QKJ?: number,
  BNDSR_DFKJ?: number,
  SNTQ_QKJ?: number,
  SNTQ_DFKJ?: number,
  TBZJF_QKJ?: string,
  TBZJF_DFKJ?: string,
  BL?: string
};

const nsrItemData = {
  NSRMC: '纳税人名称',
  JDXZMC: '隶属镇街',
  SNTQ_QKJ_ALL: '上年度全口径总税收',
  BNDSR_QKJ: '本年度全口径税收',
  SNTQ_QKJ: '同期全口径税收',
  TBZJF_QKJ: '同比增减(%)',
  BNDSR_DFKJ: '本年度地方收入',
  SNTQ_DFKJ: '同期地方收入',
  TBZJF_DFKJ: '同比增减(%)'
}

const nsrItemData2 = {
  NSRMC: '纳税人名称',
  JDXZMC: '隶属镇街',
  DJ_MLMC: '行业',
  SNTQ_QKJ_ALL: '上年度全口径总税收',
  BNDSR_QKJ: '本年度全口径税收',
  SNTQ_QKJ: '同期全口径税收',
  TBZJF_QKJ: '同比增减(%)',
  BNDSR_DFKJ: '本年度地方收入',
  SNTQ_DFKJ: '同期地方收入',
  TBZJF_DFKJ: '同比增减(%)'
}
@Component({
  templateUrl: './hy-analysis.component.html',
  styleUrls: ['./hy-analysis.component.less']
})
export class BigEnterpriseHyAnalysisComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  totalObj: ItemData = {};
  otherObj: ItemData = {};

  url = `big-enterprises/taxByMlmcsummary`;
  detailsUrl = 'big-enterprises/taxByMlmcDetails';
  taxAllDetails = 'big-enterprises/taxAllDetails'

  data: ItemData[];
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;
  // 表头设置
  columns: STColumn[] = [
    {
      title: '排行',
      type: 'no',
      render: 'order-tpl',
      className: 'text-center',
      width: 60,
      fixed: 'left'
    },
    {
      index: 'MLMC',
      title: '行业',
      className: 'text-center',
      width: 258,
      fixed: 'left'
      // width: 400
    },
    {
      index: 'COUNT',
      title: '企业户数',
      className: 'text-center',
      width: 100,
      // width: 400
    },
    {
      index: 'SNTQ_QKJ_ALL',
      title: '上年度纳税总额',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'BNDSR_QKJ',
      title: '本年度全口径税收',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'SNTQ_QKJ',
      title: '同期全口径',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJF_QKJ',
      title: '同比增减(%)',
      className: 'text-center',
      render: 'tbzjf-qkj',
    },
    {
      index: 'BNDSR_DFKJ',
      title: '本年度地方收入',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'SNTQ_DFKJ',
      title: '同期地方收入',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJF_DFKJ',
      title: '同比增减(%)',
      className: 'text-center',
      render: 'tbzjf-dfkj',
    },
    {
      index: 'BL',
      title: '税收比重(%)',
      className: 'text-center',
    },

    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          tooltip: '导出企业明细',
          icon: 'edit',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            if (record.MLMC === '其他') {
              return;
            }
            if (record.MLMC === '合计') {
              this.http.get(this.taxAllDetails, {
                ...this.getCondition()
              }).subscribe(resp => {
                this.loadSrv.open({
                  text: '正在处理……'
                });
                const data = [Object.values(nsrItemData2)];
                resp.data.forEach(i => {
                  data.push(
                    Object.keys(nsrItemData2).map(c => i[c])
                  )
                });

                this.xlsx.export({
                  sheets: [
                    {
                      data,
                      name: `重点企业税收`
                    }
                  ],
                  filename: `重点企业税收统计-${new Date().toLocaleString()}.xlsx`
                }).then(e => {
                  this.loadSrv.close();
                });
              });
              return;
            }
            this.http.get(this.detailsUrl, {
              ...this.getCondition(),
              mlmc: record.MLMC
            }).subscribe(resp => {
              this.loadSrv.open({
                text: '正在处理……'
              });
              const data = [Object.values(nsrItemData)];

              resp.data.forEach(i => {
                data.push(
                  Object.keys(nsrItemData).map(c => i[c])
                )
              });

              this.xlsx.export({
                sheets: [
                  {
                    data,
                    name: `${record.MLMC}重点企业税收`
                  }
                ],
                filename: `${record.MLMC}重点企业税收统计-${new Date().toLocaleString()}.xlsx`
              }).then(e => {
                this.loadSrv.close();
              });
            });
          }
        }
      ]
    }
  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }
  constructor(public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private xlsx: XlsxService,
    private loadSrv: LoadingService,
    private boardingSrv: OnboardingService) { }
  _onReuseDestroy: () => void;
  destroy: () => void;


  ngAfterViewInit(): void {
    this.loadSrv.open({ text: '正在处理……' });
    this.getData();
  }

  ngOnInit() { }
  /**
    * 复用路由初始化，重复进入时
    */
  _onReuseInit() {

  }
  /**
   * 开启引导模式
   */
  startBoard() {
    this.boardingSrv.start({
      showTotal: true,
      mask: true,
      items: [
        {
          selectors: '.board-2',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        },
        {
          selectors: '.board-3',
          title: '查询',
          content: '点击查询当前大企业税收情况'
        },
        {
          selectors: '.board-4',
          title: '导出',
          content: '导出查询结果'
        }
      ]
    });
  }
  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;

    return { year, startMonth, endMonth };

  }

  /**
  * st change event
  * @param e 
  */
  stChange(e: STChange) {
    if (e.type === 'click') {
      console.log(e.click.item);

    }
  }

  /**
   * 获取数据
   */
  getData() {

    this.totalObj = {};
    this.otherObj = {};

    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.loadSrv.close();

      //#region 计算合计数
      (resp.data as ItemData[]).forEach((i, index) => {

        if (index === 0) {
          this.totalObj.BNDSR_QKJ = i.BNDSR_QKJ;
          this.totalObj.BNDSR_DFKJ = i.BNDSR_DFKJ;
          this.totalObj.SNTQ_QKJ = i.SNTQ_QKJ;
          this.totalObj.SNTQ_DFKJ = i.SNTQ_DFKJ;
          this.totalObj.SNTQ_QKJ_ALL = i.SNTQ_QKJ_ALL;
          this.totalObj.COUNT = i.COUNT
        } else {
          this.totalObj.BNDSR_QKJ += i.BNDSR_QKJ;
          this.totalObj.BNDSR_DFKJ += i.BNDSR_DFKJ;
          this.totalObj.SNTQ_QKJ += i.SNTQ_QKJ;
          this.totalObj.SNTQ_DFKJ += i.SNTQ_DFKJ;
          this.totalObj.SNTQ_QKJ_ALL += i.SNTQ_QKJ_ALL;
          this.totalObj.COUNT += i.COUNT
        }

      });

      this.totalObj.TBZJF_QKJ = `${(((this.totalObj.BNDSR_QKJ - this.totalObj.SNTQ_QKJ) / this.totalObj.SNTQ_QKJ) * 100).toFixed(2)}%`
      this.totalObj.TBZJF_DFKJ = `${(((this.totalObj.BNDSR_DFKJ - this.totalObj.SNTQ_DFKJ) / this.totalObj.SNTQ_QKJ) * 100).toFixed(2)}%`
      this.totalObj.MLMC = '合计';
      this.totalObj.BL = '100%';
      //#endregion


      const result = (resp.data as ItemData[]).map(i => {
        const BL = Math.round((i.BNDSR_QKJ / this.totalObj.BNDSR_QKJ) * 10000) / 100;
        return Object.assign(i, { BL: `${BL}%` });
      })
      const other = [...result].slice(8, result.length);

      //#region 计算其他


      (other).forEach((i, index) => {

        if (index === 0) {
          this.otherObj.BNDSR_QKJ = i.BNDSR_QKJ;
          this.otherObj.BNDSR_DFKJ = i.BNDSR_DFKJ;
          this.otherObj.SNTQ_QKJ = i.SNTQ_QKJ;
          this.otherObj.SNTQ_DFKJ = i.SNTQ_DFKJ;
          this.otherObj.SNTQ_QKJ_ALL = i.SNTQ_QKJ_ALL;
          this.otherObj.COUNT = i.COUNT
        } else {
          this.otherObj.BNDSR_QKJ += i.BNDSR_QKJ;
          this.otherObj.BNDSR_DFKJ += i.BNDSR_DFKJ;
          this.otherObj.SNTQ_QKJ += i.SNTQ_QKJ;
          this.otherObj.SNTQ_DFKJ += i.SNTQ_DFKJ;
          this.otherObj.SNTQ_QKJ_ALL += i.SNTQ_QKJ_ALL;
          this.otherObj.COUNT += i.COUNT
        }

      });

      this.otherObj.TBZJF_QKJ = `${(((this.otherObj.BNDSR_QKJ - this.otherObj.SNTQ_QKJ) / this.otherObj.SNTQ_QKJ) * 100).toFixed(2)}%`
      this.otherObj.TBZJF_DFKJ = `${(((this.otherObj.BNDSR_DFKJ - this.otherObj.SNTQ_DFKJ) / this.otherObj.SNTQ_QKJ) * 100).toFixed(2)}%`
      this.otherObj.MLMC = '其他';
      this.otherObj.BL = `${Math.round((this.otherObj.BNDSR_QKJ / this.totalObj.BNDSR_QKJ) * 10000) / 100}%`;

      //#endregion

      const top = [this.totalObj, ...[...result].slice(0, 8), this.otherObj];

      this.data = top;
      console.log(top, other);
    });
  }

  /**
   * 
   */
  download() {
    this.loadSrv.open({
      text: '正在处理……'
    });
    const columns = this.columns.filter(col => col.title !== '操作' && col.title !== '排行');
    const data = [columns.map(i => i.title)];

    this.data.forEach(i => {
      data.push(
        columns.map(c => i[c.index as string])
      )
    });

    this.xlsx.export({
      sheets: [
        {
          data,
          name: '重点企业税收'
        }
      ],
      filename: `重点企业税收统计-${new Date().toLocaleString()}.xlsx`
    }).then(e => {
      this.loadSrv.close();
    });
  }
}
