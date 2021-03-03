import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, STData } from '@delon/abc/st';
import { Router, ActivatedRoute } from "@angular/router";
import { G2PieData } from '@delon/chart/pie';
import { yuan, BdgSelectComponent, MonthRangeComponent, order, ExcelData, export2excel } from '@shared';
import { forkJoin } from 'rxjs';
import { OnboardingService } from '@delon/abc';

@Component({
  selector: 'app-economic-analysis-hy-analysis',
  templateUrl: './hy-analysis.component.html',
  styleUrls: ['./hy-analysis.component.less']
})
export class EconomicAnalysisHyAnalysisComponent implements OnInit, AfterViewInit {
  hyUrl = `analysis/tax/hy`;
  cyUrl = `analysis/tax/cy`;
  qybtqTopNUrl = 'bdg/enterprise/qybtqTopN';
  selectedMlmcFlag = 'SWDJ';
  // 行业数据
  hyG2Data: G2PieData[];
  hyStData: any[];
  // 产业数据
  cyG2Data: G2PieData[];
  cyStData: any[];
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
    },
    {
      title: '操作',
      className: 'text-center',
      fixed: 'right',
      width: 80,
      buttons: [
        {
          tooltip: '税收比同期下降企业',
          icon: 'down',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../qybtq-topn'],
              {
                relativeTo: this.route,
                queryParams: { ...this.getCondition(), mlmc: record.mlmc, order: 'asc' }
              });
          }
        },
        {
          tooltip: '税收比同期增长企业',
          icon: 'up',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {

            this.router.navigate(['../qybtq-topn'],
              {
                relativeTo: this.route,
                queryParams: { ...this.getCondition(), mlmc: record.mlmc, order: 'desc' }
              });
          }
        }
      ]
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


  constructor(public http: _HttpClient,
    private boardingSrv: OnboardingService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalHelper) { }

  ngOnInit() { }

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
          title: '行业分类依据',
          content: '税务登记所属行业、电子税票开票所属行业'
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
          content: '导出查询结果'
        }
      ]
    });
  }

  /**
   * 获取行业数据
   */
  getData() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;

    const $hyStream = this.http.get(this.hyUrl, this.getCondition());
    const $cyStream = this.http.get(this.cyUrl, this.getCondition());

    forkJoin([$hyStream, $cyStream]).subscribe(response => {
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

    return { year, startMonth, endMonth, budgetValue, flag: this.selectedMlmcFlag };


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
      this.router.navigate(['../qybtq-topn'],
        {
          relativeTo: this.route,
          queryParams: { ...this.getCondition(), mlmc: item.mlmc, order: 'desc' }
        });

    }
  }
  /**
   * 导出表格数据
   */
  export() {
    const filename = `产业行业税收-${new Date().toLocaleString()}.xlsx`;

    const hyRowData = this.hyStData.map(i => {
      return {
        '门类名称': i.mlmc,
        '本年度收入(万元)': i.bndsr,
        '上年同期收入(万元)': i.sntq,
        '同比增减（万元）': i.tbzjz,
        '同比增减幅': i.tbzjf
      }
    });
    const cyRowData = this.cyStData.map(i => {
      return {
        '产业名称': i.cymc,
        '本年度收入(万元)': i.bndsr,
        '上年同期收入(万元)': i.sntq,
        '同比增减（万元）': i.tbzjz,
        '同比增减幅': i.tbzjf
      }
    });

    const data: ExcelData[] = [
      {
        sheetName: '行业收入',
        rowData: hyRowData
      }, {
        sheetName: '产业收入',
        rowData: cyRowData
      }
    ];
    export2excel(filename, data);
  }
}
