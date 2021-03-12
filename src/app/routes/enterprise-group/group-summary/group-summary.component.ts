import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STData, STChange } from '@delon/abc/st';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
// import { NzTreeSelectComponent, NzMessageService } from 'ng-zorro-antd';

import { CacheService } from '@delon/cache';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, OnboardingService, XlsxService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-enterprise-group-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.less']
})
export class EnterpriseGroupGroupSummaryComponent implements OnInit, AfterViewInit {

  // 统计栏目；本年度、上年同期、同比增减；
  bndTotal = 0;
  sntqTotal = 0;
  tbzjTotal = 0;
  upCount = 0;
  downCount = 0;

  url = `enterprise-group/taxsummary`;
  isZxsr = true; //是否包含专项收入

  @ViewChild('st') st: STComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

  data: any[];
  total: number;

  // 表头设置
  columns: STColumn[] = [
    {
      title: '排行',
      width: 60,
      className: 'text-center',
      fixed: 'left',
      render: 'order-tpl',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.st.pi - 1) * this.st.ps + index + 1}`;

      }

    },
    {
      index: 'jtmc',
      title: '纳税人名称',
      className: 'text-center',
      fixed: 'left',
      width: 340
    },
    {
      index: 'bndsr',
      title: '本年度',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'sntq',
      title: '上年同期',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'tbzjz',
      title: '同比增减',
      className: 'text-center',
      // type: 'number'
      render: 'tbzjz-tpl'
    },
    {
      index: 'tbzjf',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl'
    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          tooltip: '查看集团子公司明细',
          icon: 'eye',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../zgs-list'], {
              queryParams: { jtmc: record.jtmc },
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
    showSize: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    public msg: NzMessageService,
    private boardingSrv: OnboardingService,
    private xlsx: XlsxService,
    private router: Router,
    private route: ActivatedRoute,
    private loadSrv: LoadingService
  ) {

  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
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
          selectors: '.board-1',
          title: '预算级次选择',
          content: '中央级、省级、市级、区县级等，可组合进行选择'
        },
        {
          selectors: '.board-2',
          title: '纳税额',
          content: '本年度纳税金额'
        },
        {
          selectors: '.board-3',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        },
        {
          selectors: '.board-4',
          title: '查询',
          content: '点击查询结果'
        },
        {
          selectors: '.board-5',
          title: '导出',
          content: '将当前查询结果，添加至本年度大企业库'
        }
      ]
    });
  }

  /**
   * 获取税收统计概况（电子税票）
   */
  getData() {

    this.bndTotal = 0;
    this.sntqTotal = 0;
    this.tbzjTotal = 0;
    this.upCount = 0;
    this.downCount = 0;

    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.data = resp.data;
      this.total = resp.data.length;
      this.data.forEach(el => {
        this.bndTotal += el.bndsr;
        this.sntqTotal += el.sntq;
        if (el.tbzjz > 0) {
          ++this.upCount;
        } else {
          ++this.downCount;
        }
      });

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


    return { year, startMonth, endMonth, budgetValue, isZxsr: this.isZxsr };

  }
  /**
   * G2 PIE 图表tooltip
   * @param value
   */
  change(e: STChange) {
    if (e.click && e.click.item) {
      const { NSRMC, lat, lng } = e.click.item;
    }
  }

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
          name: '集团税收统计'
        }
      ],
      filename: `集团税收统计-${new Date().toLocaleString()}.xlsx`
    }).then(e => {
      this.loadSrv.close();
    });
  }

}

