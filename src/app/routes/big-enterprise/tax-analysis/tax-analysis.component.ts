import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STPage } from '@delon/abc/st';
import { BdgSelectComponent, MonthRangeComponent } from '@shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-big-enterprise-tax-analysis',
  templateUrl: './tax-analysis.component.html',
  styleUrls: ['./tax-analysis.component.less']
})
export class BigEnterpriseTaxAnalysisComponent implements OnInit, AfterViewInit {

  bndTotal = 0;
  sntqTotal = 0;
  tbzjTotal = 0;
  upCount = 0;
  downCount = 0;

  url = `big-enterprises/taxsummary`;
  data: any[];
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st') st: STComponent;
  // 表头设置
  columns: STColumn[] = [
    {
      index: 'NSRMC',
      title: '纳税人名称',
      className: 'text-center',
      fixed: 'left',
      // width: 400
    },
    {
      index: 'BNDSR',
      title: '本年度税收(万元)',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'SNTQ',
      title: '上年同期(万元)',
      className: 'text-center',
      type: 'number'
    },
    {
      index: 'TBZJZ',
      title: '同比增减(万元)',
      className: 'text-center',
      type: 'number',
      render: 'tbzjz-tpl',
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl',
    },
    {
      index: 'BNDPM',
      title: '本年度排名',
      className: 'text-center',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.BNDPM;
          const val2 = b.BNDPM;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      },
    },
    {
      index: 'SNDPM',
      title: '上年度排名',
      className: 'text-center',
      type: 'number',
      sort: {
        compare: (a, b) => {
          const val1 = a.SNDPM;
          const val2 = b.SNDPM;
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0
          }
        }
      }
    },
    {
      index: 'PMZJ',
      title: '排名升降',
      className: 'text-center',
      type: 'number',
      render: 'pmzj-tpl',
      filter: {
        multiple: false,
        menus: [
          { text: '上升', value: '上升' },
          { text: '下降', value: '下降' }
        ],
        fn: (filter, record) => {
          if (filter.value === '上升') {
            return record.PMZJ >= 0;
          } else {
            return record.PMZJ < 0;

          }
        },

      }
    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
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
  // 分页设置
  page: STPage = {
    show: true,
    front: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalHelper) { }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.query();
    });
  }

  ngOnInit() { }


  getCondition() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();

    return { year, startMonth, endMonth, budgetValue };

  }

  query() {

    this.bndTotal = 0;
    this.sntqTotal = 0;
    this.tbzjTotal = 0;
    this.upCount = 0;
    this.downCount = 0;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.data = resp.data;

      this.data.forEach(el => {
        this.bndTotal += el.BNDSR;
        this.sntqTotal += el.SNTQ;
        if (el.TBZJZ > 0) {
          ++this.upCount;
        } else {
          ++this.downCount;
        }
      });

      console.log('bndTotal:', this.bndTotal);
    });
  }

}
