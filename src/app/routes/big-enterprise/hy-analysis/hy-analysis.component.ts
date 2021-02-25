
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
  MLMC: string,
  COUNT: number,
  SNTQ_QKJ_ALL: number,
  BNDSR_QKJ: number,
  BNDSR_DFKJ: number,
  SNTQ_QKJ: number,
  SNTQ_DFKJ: number,
  TBZJF_QKJ: string,
  TBZJF_DFKJ: string
}

@Component({
  templateUrl: './hy-analysis.component.html',
  styleUrls: ['./hy-analysis.component.less']
})
export class BigEnterpriseHyAnalysisComponent implements OnInit, AfterViewInit, ReuseComponentInstance {

  bndTotal = 0;
  sntqTotal = 0;
  tbzjTotal = 0;
  upCount = 0;
  downCount = 0;

  url = `big-enterprises/taxByMlmcsummary`;
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
          selectors: '.board-1',
          title: '预算级次选择',
          content: '中央级、省级、市级、区县级等，可组合进行选择'
        },
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
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.loadSrv.close();
      this.data = [...resp.data];

      console.log(this.data);
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
          name: '大企业税收'
        }
      ],
      filename: `大企业税收统计-${new Date().toLocaleString()}.xlsx`
    }).then(e => {
      this.loadSrv.close();
    });
  }
}
