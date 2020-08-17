
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STData, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { NzTreeSelectComponent, NzMessageService } from 'ng-zorro-antd';
import { IEOrder } from '@shared';
import { CacheService } from '@delon/cache';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '@delon/abc';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class BigEnterpriseCreateComponent implements OnInit, AfterViewInit {
  url = `bdg/enterprise/tax`;
  createUrl = `manage/big-enterprises`;
  @ViewChild('st') st: STComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;
  @ViewChild('hyTreeSelect') hyTreeSelect: NzTreeSelectComponent;
  hymcNodes;
  selectedHymc: string;
  selectedValue = 1000;

  data: IEOrder[];
  total: number;

  // 表头设置
  columns: STColumn[] = [
    {
      title: '排名',
      width: 60,
      className: 'text-center',
      fixed: 'left',
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
      width: 260
    },
    {
      index: 'BNDSR',
      title: '本年度',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'SNTQ',
      title: '上年同期',
      className: 'text-center',
      type: 'number',
    },
    {
      index: 'TBZJZ',
      title: '同比增减',
      className: 'text-center',
      // type: 'number'
      render: 'tbzjz-tpl'
    },
    {
      index: 'TBZJF',
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
    showSize: true,
    pageSizes: [10, 20, 30, 50, 100]
  }

  constructor(public http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private cacheSrv: CacheService,
    private router: Router,
    private route: ActivatedRoute,
    private loadSrv: LoadingService
  ) {
    this.hymcNodes = this.cacheSrv.get('hymc', { mode: 'none' });
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }
  /**
   * 获取税收统计概况（电子税票）
   */
  getData() {
    this.bdgSelect.budgetValue.length === 0 ? this.bdgSelect.budgetValue = [4] : null;
    this.http.get(this.url, this.getCondition()).subscribe(resp => {
      this.data = resp.data;
      this.total = resp.data.length;

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
    const value = this.selectedValue;
    const adminCode = '3302130000';
    return { adminCode, year, startMonth, endMonth, budgetValue, value };
    // if (!this.hyTreeSelect.getSelectedNodeList().length) {
    //   return { adminCode, year, startMonth, endMonth, budgetValue, value };
    // }
    // if (this.hyTreeSelect.getSelectedNodeList().length !== 0) {
    //   const selectedNode = this.hyTreeSelect.getSelectedNodeList()[0];
    //   return selectedNode.parentNode ? { adminCode, year, startMonth, endMonth, budgetValue, value, hymc: selectedNode.title } :
    //     { adminCode, year, startMonth, endMonth, budgetValue, value, mlmc: selectedNode.title };
    // }

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

  download() {

  }

  create() {
    const nsrmcs = this.data.map(item => item.NSRMC);
    this.http.post(this.createUrl, {
      nsrmcs,
      year: this.monthRange.startDate.getFullYear(),
      filter: this.selectedValue
    }).subscribe(resp => {
      this.msg.success(resp.msg);
    });
  }
}
