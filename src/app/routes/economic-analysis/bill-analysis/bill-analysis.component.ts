import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { BdgSelectComponent, MonthRangeComponent } from '@shared';
import { G2TimelineData, G2TimelineMap } from '@delon/chart/timeline';

@Component({
  selector: 'app-economic-analysis-bill-analysis',
  templateUrl: './bill-analysis.component.html',
  styleUrls: ['./bill-analysis.component.less']
})
export class EconomicAnalysisBillAnalysisComponent implements OnInit, AfterViewInit {
  url = `analysis/invoice`;
  billData: any[];
  selectedZsxm = '增值税';
  countG2LineData;
  valueG2LineData;
  titleMap: G2TimelineMap = {
    y1: '本年度',
    y2: '上年同期'
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  columns: STColumn[] = [
    {
      title: '月份',
      index: 'MONTH',
      width: 60,
      className: 'text-center'
    },
    {
      title: '开票数量（张）',
      children: [
        {
          title: '本年度',
          type: 'number',
          index: 'BND_COUNT',
          className: 'text-center',
          statistical: 'sum',
          key: 'BND_COUNT'
        },
        {
          title: '上年同期',
          type: 'number',
          index: 'SNTQ_COUNT',
          className: 'text-center',
          statistical: 'sum',
          key: 'SNTQ_COUNT'
        },
        {
          title: '同比增减',
          type: 'number',
          index: 'TBZJZ_COUNT',
          className: 'text-center',
          render: 'tbzjz-count-tpl'
        },
        {
          title: '同比增减幅',
          index: 'TBZJF_COUNT',
          className: 'text-center',
          render: 'tbzjf-count-tpl'
        },
      ]
    },
    {
      title: '开票金额（万元）',
      children: [
        {
          title: '本年度',
          type: 'number',
          index: 'BND_VALUE',
          className: 'text-center',
          statistical: 'sum',
          key: 'BND_VALUE'
        },
        {
          title: '上年同期',
          type: 'number',
          index: 'SNTQ_VALUE',
          className: 'text-center',
          statistical: 'sum',
          key: 'SNTQ_VALUE'
        },
        {
          title: '同比增减',
          type: 'number',
          index: 'TBZJZ_VALUE',
          className: 'text-center',
          render: 'tbzjz-val-tpl'
        },
        {
          title: '同比增减幅',
          index: 'TBZJF_VALUE',
          className: 'text-center',
          render: 'tbzjf-val-tpl'
        },
      ]
    },
  ];

  padding = [40, 8, 64, 40]

  constructor(public http: _HttpClient,
    private msgSrv: NzMessageService,
    private modal: ModalHelper) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }


  getData() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;

    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.billData = resp.data;

      this.countG2LineData = this.billData.map(item => {
        const date = new Date();
        date.setFullYear(this.monthRange.startDate.getFullYear(), item.MONTH - 1)
        return {
          time: date,
          y1: item.BND_COUNT,
          y2: item.SNTQ_COUNT
        }
      });

      this.valueG2LineData = this.billData.map(item => {
        const date = new Date();
        date.setFullYear(this.monthRange.startDate.getFullYear(), item.MONTH - 1)
        return {
          time: date,
          y1: item.BND_VALUE,
          y2: item.SNTQ_VALUE
        }
      });
    });
  }

  /**
   * 
   */
  getCondition() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();
    return { year, startMonth, endMonth, budgetValue, zsxmmc: this.selectedZsxm };

  }

}
