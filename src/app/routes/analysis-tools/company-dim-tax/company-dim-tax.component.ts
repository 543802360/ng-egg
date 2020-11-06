import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STRes, STPage, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthRangeComponent, BdgSelectComponent } from '@shared';
const ZSXM = {
  10101: '增值税',
  10102: '消费税',
  10103: '营业税',
  10104: '企业所得税',
  10106: '个人所得税',
  10107: '资源税',
  10109: '城市维护建设税',
  10110: '房产税',
  10111: '印花税',
  10112: '城镇土地使用税',
  10113: '土地增值税',
  10114: '车船税',
  10116: '车辆购置税',
  10118: '耕地占用税',
  10119: '契税',
  10120: '烟叶税',
  10121: '环境保护税',
  10199: '其他税收收入',
  10302: '专项收入'

}
@Component({
  selector: 'app-analysis-tools-company-dim-tax',
  styleUrls: ['./company-dim-tax.component.less'],
  templateUrl: './company-dim-tax.component.html',
})
export class AnalysisToolsCompanyDimTaxComponent implements OnInit {
  url = `bdg/tools/dimtax`;

  nsrmc: string;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('st', { static: false }) st: STComponent;
  taxData: any[];
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
      fixed: 'left',
      render: 'order-tpl',
      format: (item: STData, col: STColumn, index: number) => {
        // console.log('index', index, item, col);
        // console.log(this.st);
        return `${(this.st.pi - 1) * this.st.ps + index + 1}`;

      }

    },
    {
      index: 'NSRMC',
      title: '纳税人名称',
      className: 'text-center',
      fixed: 'left',
      width: 300
    },
    {
      index: 'BNDSR',
      title: '本年度',
      className: 'text-center',
      type: 'number',
      width: 120
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number',
      width: 120
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      // type: 'number'
      render: 'tbzjz-tpl',
      width: 120
    },
    {
      index: 'TBZJF',
      title: '同比增减幅',
      className: 'text-center',
      render: 'tbzjf-tpl',
      width: 120

    },
    {
      title: '操作',
      className: 'text-center',
      width: 60,
      fixed: 'right',
      buttons: [
        {
          // tooltip: '详情',
          icon: 'info',
          // 点击查询详细税收
          click: (record: STData, modal: true) => {
            this.router.navigate(['../single-query'], {
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
    private msgSrv: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalHelper) { }

  ngOnInit() { }


  getData() {

    if (!this.nsrmc) {
      this.msgSrv.warning('纳税人名称不能为空，请输入要搜索的纳税人名称！');
      return;
    }

    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [1, 3, 4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.taxData = resp.data;
      this.total = resp.data.length;
    });


  }
  /**
   * 获取查询条件参数
   */
  getCondition() {
    // 获取查询参数
    const { startDate, endDate } = this.monthRange;
    const year = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const budgetValue = this.bdgSelect.budgetValue.toLocaleString();


    return { year, startMonth, endMonth, budgetValue, nsrmc: this.nsrmc };


  }
  /**
   * G2 PIE 图表tooltip
   * @param value
   */
  change(e: STChange) {
    console.log(e);
    if (e.click && e.click.item) {
      const { NSRMC, lat, lng } = e.click.item;
    }
  }

  export() {

  }



}
