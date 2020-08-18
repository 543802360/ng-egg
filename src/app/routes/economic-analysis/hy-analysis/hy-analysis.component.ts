import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { G2PieData } from '@delon/chart/pie';
import { yuan, BdgSelectComponent, MonthRangeComponent, order } from '@shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-economic-analysis-hy-analysis',
  templateUrl: './hy-analysis.component.html',
  styleUrls: ['./hy-analysis.component.less']
})
export class EconomicAnalysisHyAnalysisComponent implements OnInit, AfterViewInit {
  hyUrl = `analysis/tax/hy`;
  cyUrl = `analysis/tax/cy`;
  selectedMlmcFlag = 'MLMC';
  // 行业数据
  hyG2Data: G2PieData[];
  hyStData;
  // 产业数据
  cyG2Data: G2PieData[];
  cyStData;
  // zong
  total: number;

  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;

  columns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      className: 'text-center',
      render: 'order-tpl',
      width: 60
    },
    {
      title: '门类名称',
      index: 'mlmc',
      className: 'text-center',
      width: 200
    },
    {
      title: '本年度收入',
      index: 'bndsr',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'bndsr'
    }
    ,
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'sntq'
    },
    {
      title: '同比增减',
      index: 'tbzjz',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl'
    },
    {
      title: '同比增减幅',
      index: 'tbzjf',
      className: 'text-center',
      render: 'tbzjf-tpl'
    }
  ]

  cyColumns: STColumn[] = [
    {
      title: '排名',
      type: 'no',
      className: 'text-center',
      render: 'order-tpl',
      width: 60
    },
    {
      title: '产业名称',
      index: 'cymc',
      className: 'text-center',
      width: 200
    },
    {
      title: '本年度收入',
      index: 'bndsr',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'bndsr'
    },
    {
      title: '上年同期',
      index: 'sntq',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'sntq'
    },
    {
      title: '同比增减',
      index: 'tbzjz',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl'
    },
    {
      title: '同比增减幅',
      index: 'tbzjf',
      className: 'text-center',
      render: 'tbzjf-tpl'
    }
  ]


  constructor(public http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }

  getData() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;

    const $hyStream = this.http.get(this.hyUrl, this.getCondition());
    const $cyStream = this.http.get(this.cyUrl, this.getCondition());

    forkJoin($hyStream, $cyStream).subscribe(response => {
      const [hyResp, cyResp] = response;
      // 行业
      this.hyStData = hyResp.data;
      this.hyG2Data = hyResp.data.map(item => {
        return {
          x: item.mlmc,
          y: item.bndsr
        }
      }).sort(order('y'));
      // 产业
      this.cyStData = cyResp.data;
      this.cyG2Data = cyResp.data.map(item => {
        return {
          x: item.cymc,
          y: item.bndsr
        }
      }).sort(order('y'));
      // total
      this.total = this.hyG2Data.reduce((pre, now) => (now as any).y + pre, 0);
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
    const adminCode = '3302130000';

    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    return { year, startMonth, endMonth, budgetValue, flag: this.selectedMlmcFlag };


  }
  handlePieValueFormat(value: any) {
    return yuan(value);
  }
}
