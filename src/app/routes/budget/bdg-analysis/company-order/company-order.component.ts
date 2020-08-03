import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STData, STPage, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzTreeSelectComponent } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { yuan, IEOrder } from '@shared';
import { getTimeDistance } from '@delon/util';

@Component({
  selector: 'app-budget-bdg-analysis-company-order',
  templateUrl: './company-order.component.html',
  styleUrls: ['./company-order.component.less']
})
export class BudgetBdgAnalysisCompanyOrderComponent implements OnInit, AfterViewInit {


  //#region 预算级次
  // date
  date_range: Date[] = [];
  startDate: Date;
  endDate: Date;
  // 预算级次value
  budgetValue: number[] = [4]
  budgetNodes = [{
    title: '中央级',
    value: 1,
    key: 1
  },
  {
    title: '市级',
    value: 3,
    key: 3
  },
  {
    title: '区县级',
    value: 4,
    key: 4
  }];
  // 行业名称tree-select
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  hymcNodes;
  selectedHymc: string;

  selectedOrder = 100;

  //#endregion
  @ViewChild('st') st: STComponent;
  url = "bdg/enterprise/order";
  data: IEOrder[];
  params = {
    adminCode: 3302130000,
    year: 2020,
    startMonth: 1,
    endMonth: 7,
    bdg_value: this.budgetValue,
    count: 100
  };
  total = 0;
  // response预处理
  res: STRes = {
    process: (data: STData[], rawData?: any) => {
      this.total = rawData.data.length;
      return rawData.data;
    }
  };
  // 表头设置
  columns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.st.pi - 1) * this.st.ps + index + 1}`;

      }

    },
    {
      index: 'PAYER_ID',
      title: '纳税人识别号',
      className: 'text-center',

    },
    {
      index: 'PAYMENT_NAME',
      title: '纳税人名称',
      className: 'text-center',

    },
    {
      index: 'BNDSR',
      title: '本年度收入',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      // type: 'number'
      render: 'tbzjz-tpl'
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl'

    }
  ]
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private cacheSrv: CacheService
  ) {
    const date = new Date();
    this.startDate = new Date(date.getFullYear(), 0);
    this.endDate = date;

    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }

  /**
   * 设置日期
   * @param type: 时间段类型
   * @param flag
   */
  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    this.startDate = this.date_range[0];
    this.endDate = this.date_range[1];
    setTimeout(() => this.cdr.detectChanges());
  }


  /**
   * 获取税收统计概况（电子税票）
   */
  getData() {
    this.budgetValue.length === 0 ? this.budgetValue = [4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.data = resp.data;
      this.total = resp.data.length;
    })


  }
  /**
   * 获取查询条件参数
   */
  getCondition() {
    const year = this.startDate.getFullYear();
    const startMonth = this.startDate.getMonth() + 1;
    const endMonth = this.endDate.getMonth() + 1;
    const budgetValue = this.budgetValue.toLocaleString();
    const mlmc = this.hyTreeSelect.getSelectedNodeList();
    const count = this.selectedOrder;
    const adminCode = '3302130000';

    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    if (!this.hyTreeSelect.getSelectedNodeList().length) {
      return { adminCode, year, startMonth, endMonth, budgetValue, count };
    }
    if (this.hyTreeSelect.getSelectedNodeList().length !== 0) {
      const selectedNode = this.hyTreeSelect.getSelectedNodeList()[0];
      return selectedNode.parentNode ? { adminCode, year, startMonth, endMonth, budgetValue, count, hymc: selectedNode.title } :
        { adminCode, year, startMonth, endMonth, budgetValue, count, mlmc: selectedNode.title };
    }

  }
  /**
   * G2 PIE 图表tooltip
   * @param value
   */
  change(e: STChange) {
    console.log(e);
  }
}
