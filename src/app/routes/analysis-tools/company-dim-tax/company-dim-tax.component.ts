import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STRes, STPage, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthRangeComponent, BdgSelectComponent, export2excel } from '@shared';
import { LoadingService, OnboardingService } from '@delon/abc';
/**
 * 征收项目key
 */
const ZSXM = {
  '增值税': '增值税',
  '消费税': '消费税',
  '营业税': '营业税',
  '企业所得税': '企业所得税',
  '个人所得税': '个人所得税',
  '资源税': '资源税',
  '城市维护建设税': '城市维护建设税',
  '房产税': '房产税',
  '印花税': '印花税',
  '城镇土地使用税': '城镇土地使用税',
  '土地增值税': '土地增值税',
  '车船税': '车船税',
  '车辆购置税': '车辆购置税',
  '耕地占用税': '耕地占用税',
  '契税': '契税',
  '烟叶税': '烟叶税',
  '环境保护税': '环境保护税',
  '其他税收收入': '其他税收收入',
  '教育费附加收入': '教育费附加收入',
  '地方教育附加收入': '地方教育附加收入',
  '残疾人就业保障金收入': '残疾人就业保障金收入',
  '水利建设专项收入': '水利建设专项收入',
  '文化事业建设费收入': '文化事业建设费收入',
}
const itemInfo =
{
  NSRMC: "纳税人名称",
  BNDSR: '本年度收入(万元)',
  SNTQ: '上年同期(万元)',
  TBZJF: "同比增减幅",
  TBZJZ: '同比增减值(万元)'
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
      width: 120,
      // format:(item,col,index)=>{
      //   // return item;
      //   // return {}
      // }
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
    private boardingSrv: OnboardingService,
    private msgSrv: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingSrv: LoadingService) { }

  ngOnInit() { }

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
          title: '纳税人名称',
          content: '请输入纳税人名称，长度不小于2'
        },
        {
          selectors: '.board-2',
          title: '预算级次选择',
          content: '中央级、省级、市级、区县级等，可组合进行选择'
        },
        {
          selectors: '.board-3',
          title: '入库时间',
          content: '选择税收入库时间范围，同年内的'
        }
        ,
        {
          selectors: '.board-4',
          title: '查询',
          content: '点击查询结果'
        },
        {
          selectors: '.board-5',
          title: '导出',
          content: '点击当前查询结果'
        }
      ]
    });
  }
  /**
   * 模糊查询企业税收
   */
  getData() {

    if (!this.nsrmc) {
      this.msgSrv.warning('纳税人名称不能为空，请输入要搜索的纳税人名称！');
      return;
    }
    if (this.nsrmc.trim().length < 2) {
      this.msgSrv.warning('请最少输入两个字符！');
      return;
    }

    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [1, 3, 4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.taxData = resp.data.map(i => {
        const BNDSR = Math.round(i.BNDSR / 100) / 100;
        const SNTQ = Math.round(i.SNTQ / 100) / 100;
        const TBZJZ = Math.round(i.TBZJZ / 100) / 100;
        return { ...i, BNDSR, SNTQ, TBZJZ }

      });
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
    // 批量查询税收
    const nsrmcs = this.taxData.map(item => item.NSRMC);
    this.http.post('bdg/tools/batchQuery', {
      nsrmcs,
      ...this.getCondition()
    }).subscribe(resp => {
      // 查询结果按指定字典排序映射
      const rowData = resp.data.map(item => {
        const el = {};
        Object.keys(itemInfo).forEach(key => {
          el[itemInfo[key]] = item[key];
        });
        Object.keys(ZSXM).forEach(key => {
          el[ZSXM[key]] = item[key] ? item[key] : 0;
        });
        return el;
      });
      this.loadingSrv.close();
      export2excel(`${this.nsrmc}-税收导出-${new Date().toLocaleString()}.xlsx`, [{
        sheetName: '税收导出',
        rowData
      }]);

    });
  }



}
