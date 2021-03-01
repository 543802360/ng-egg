import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, STPage, STData } from '@delon/abc/st';
import { Router, ActivatedRoute } from "@angular/router";
import { yuan, BdgSelectComponent, MonthRangeComponent, order, ExcelData, export2excel, EOrder, ZSXM } from '@shared';


@Component({
  selector: 'app-economic-analysis-qybtq-topn',
  templateUrl: './qybtq-topn.component.html',
  styleUrls: ['./qybtq-topn.component.less']
})
export class EconomicAnalysisQybtqTopnComponent implements OnInit, AfterViewInit {
  qybtqTopNUrl = 'bdg/enterprise/qybtqTopN';
  qybtqTopNData: [];

  title = "";
  mlmc = '';
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }
  columns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      className: 'text-center',
      render: 'order-tpl',
      width: 60
    },
    {
      title: '纳税人名称',
      index: 'NSRMC',
      className: 'text-center',
    },
    {
      title: '隶属镇街',
      index: 'JDXZMC',
      className: 'text-center',
    },
    {
      title: '本年度收入',
      index: 'BNDSR',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'bndsr'
    }
    ,
    {
      title: '上年同期',
      index: 'SNTQ',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'sntq'
    },
    {
      title: '同比增减',
      index: 'TBZJZ',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl'
    },
    {
      title: '同比增减幅',
      index: 'TBZJF',
      className: 'text-center',
      render: 'tbzjf-tpl'
    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      buttons: [
        {
          // tooltip: '详情',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../../budget/single-query'], {
              queryParams: { nsrmc: record.NSRMC },
              relativeTo: this.route
            });
          }
        }
      ]
    }
  ]
  constructor(public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(resp => {
      this.mlmc = resp.mlmc;
      this.title = `${this.mlmc}企业税收比同期下降Top100`
      this.http.get(this.qybtqTopNUrl, {
        ...resp
      }).subscribe(resp => {

        this.qybtqTopNData = resp.data;
      });

    });
  }

  /**
   * 获取行业数据
   */
  getData() {
    this.http.get(this.qybtqTopNUrl, {
      ...this.getCondition(),
      mlmc: this.mlmc
    }).subscribe(resp => {
      this.qybtqTopNData = resp.data;
    });

  }
  /**
   * 获取查询条件参数
   */
  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    return { year, startMonth, endMonth, budgetValue };


  }
  handlePieValueFormat(value: any) {
    return yuan(value);
  }
  /**
   * st change event
   * @param e 
   */
  stChange(e: STChange) {
    if (e.type === 'click') {
      const { item } = e.click;
      this.http.get(this.qybtqTopNUrl, {
        ...this.getCondition(),
        mlmc: item.mlmc
      }).subscribe(resp => { console.log('qybtq topn:', resp) });
    }
  }
  /**
   * 导出表格数据
   */
  export() {
    // 查询结果按指定字典排序映射
    const rowData = this.qybtqTopNData.map(item => {
      const el = {};
      Object.keys(EOrder).forEach(key => {
        el[EOrder[key]] = item[key];
      });
      Object.keys(ZSXM).forEach(key => {
        el[ZSXM[key]] = item[key] ? item[key] : 0;
      });
      return el;
    });
    export2excel(`${this.title}-${new Date().toLocaleString()}.xlsx`, [{
      sheetName: 'sheet1',
      rowData
    }]);

  }
}

