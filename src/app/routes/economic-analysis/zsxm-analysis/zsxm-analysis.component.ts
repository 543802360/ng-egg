import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange } from '@delon/abc/st';
import { Router, ActivatedRoute } from "@angular/router";
import { G2PieData } from '@delon/chart/pie';
import { yuan, BdgSelectComponent, MonthRangeComponent, order, ExcelData, export2excel } from '@shared';
import { forkJoin } from 'rxjs';
import { OnboardingService } from '@delon/abc';
import { zsxmData } from '_mock/mock-data/zsxm';

@Component({
  selector: 'app-economic-analysis-zsxm-analysis',
  templateUrl: './zsxm-analysis.component.html',
  styleUrls: ['./zsxm-analysis.component.less']
})
export class EconomicAnalysisZsxmAnalysisComponent implements OnInit, AfterViewInit {
  zsxmUrl = `analysis/tax/zsxm`;
  zsxmG2Data: G2PieData[];
  zsxmStData: any[];
  // zong
  total: number;
  totalItem = {
    ZSXMMC: '合计',
    BNDSR: 0,
    SNTQ: 0,
    TBZJZ: 0,
    TBZJF: ''
  };
  isZxsr = true;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('zsxmSt') zsxmSt: STComponent;

  columns: STColumn[] = [
    // {
    //   title: '排名',
    //   type: 'no',
    //   className: 'text-center',
    //   render: 'order-tpl',
    //   width: 60
    // },
    {
      title: '征收项目',
      index: 'ZSXMMC',
      className: 'text-center',
      width: 160
    },
    {
      title: '本年度收入',
      index: 'BNDSR',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'BNDSR'
    }
    ,
    {
      title: '上年同期',
      index: 'SNTQ',
      className: 'text-center',
      type: 'number',
      statistical: 'sum',
      key: 'SNTQ'
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

    const $zsxmStream = this.http.get(this.zsxmUrl, this.getCondition());

    $zsxmStream.subscribe(zsxmResp => {
      this.zsxmStData = zsxmResp.data.filter(i => i.BNDSR !== 0);
      if (!this.isZxsr) {
        this.zsxmStData = [... this.zsxmStData].filter(i => i.ZSXMDM !== '10302');
      }
      this.zsxmG2Data = this.zsxmStData.map(item => {
        this.totalItem.BNDSR += item.BNDSR;
        this.totalItem.SNTQ += item.SNTQ;
        return {
          x: item.ZSXMMC,
          y: item.BNDSR
        }
      }).sort(order('y'));
      // total
      this.totalItem.TBZJZ = Math.round((this.totalItem.BNDSR - this.totalItem.SNTQ) * 100) / 100;
      this.totalItem.TBZJF = ((this.totalItem.BNDSR - this.totalItem.SNTQ) / this.totalItem.SNTQ * 100).toFixed(2) + "%";

      this.total = this.zsxmG2Data.reduce((pre, now) => (now as any).y + pre, 0);
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
    }
  }
  /**
   * 导出表格数据
   */
  export() {
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const filename = `分税种税收收入-${year}年${startMonth}-${endMonth}月.xlsx`;

    this.zsxmStData.push(this.totalItem);

    const zsxmRowData = this.zsxmStData.map(i => {
      return {
        '征收项目': i.ZSXMMC,
        '本年度收入(万元)': i.BNDSR,
        '上年同期收入(万元)': i.SNTQ,
        '同比增减（万元）': i.TBZJZ,
        '同比增减幅': i.TBZJF
      }
    });

    const data: ExcelData[] = [
      {
        sheetName: '分税种收入',
        rowData: zsxmRowData
      }
    ];
    export2excel(filename, data);
  }
}
