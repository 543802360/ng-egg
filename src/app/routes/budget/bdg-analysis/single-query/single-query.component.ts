import { G2BarData } from '@delon/chart/bar';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { BdgSelectComponent } from 'src/app/shared/components/bdg-select/bdg-select.component';
import { MonthRangeComponent } from 'src/app/shared/components/month-range/month-range.component';
import { forkJoin } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { order } from '@shared';
import { delay } from 'rxjs/operators';
import { LoadingService } from '@delon/abc';
import { deepCopy } from '@delon/util';
import { ActivatedRoute } from '@angular/router';
import { NsrmcSuggestionComponent } from 'src/app/shared/components/nsrmc-suggestion/nsrmc-suggestion.component';

@Component({
  selector: 'app-budget-bdg-analysis-single-query',
  templateUrl: './single-query.component.html',
  styleUrls: ['./single-query.component.less']
})
export class BudgetBdgAnalysisSingleQueryComponent implements OnInit, AfterViewInit {
  zsxmUrl = `bdg/enterprise/tax/zsxm`;
  taxByZsxmData;
  zsxmBarData;

  total: number;
  historyUrl = `bdg/enterprise/tax/history`;
  taxByYearData: G2BarData[];

  nsrmc = '';
  @ViewChild('nsrSug') nsrSug: NsrmcSuggestionComponent;
  @ViewChild('bdgSelect') bdgSelect: BdgSelectComponent;
  @ViewChild('monthRange') monthRange: MonthRangeComponent;

  @ViewChild('st') st: STComponent;
  columns: STColumn[];

  constructor(private http: _HttpClient,
    private loadSrv: LoadingService,
    private msgSrv: NzMessageService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      const { nsrmc } = params;
      setTimeout(() => {
        this.nsrmc = nsrmc ? nsrmc : '';
        this.bdgSelect.budgetValue = [4];
        if (this.nsrmc && this.bdgSelect.budgetValue) {
          this.search();
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

    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    return { nsrmc: this.nsrmc, year, startMonth, endMonth, budgetValue };
  }


  /**
   * 查询
   * @param e 
   */
  search() {
    if (!this.nsrmc) {
      this.nsrmc = this.nsrSug._nsrmc;
    }
    if (!this.nsrmc) {
      this.msgSrv.warning('请输入纳税人名称!');
      return;
    }
    if (!this.bdgSelect.budgetValue.length) {
      this.msgSrv.warning('请选择预算级次');
      return;
    }
    this.loadSrv.open({ text: '正在查询……' });

    const $stream1 = this.http.get(this.zsxmUrl, this.getCondition());
    const $stream2 = this.http.get(this.historyUrl, {
      nsrmc: this.nsrmc,
      ...this.getCondition()
    });

    forkJoin([$stream1, $stream2]).pipe(delay(1000)).subscribe(resp => {
      this.loadSrv.close();
      // 分税种明细
      const zsxmMap = new Map(Object.entries(resp[0].data).filter(item => item[1] !== 0));
      const zsxmData = (Object as any).fromEntries(zsxmMap);

      // 设置征收项目表头
      this.columns = Object.keys(zsxmData).map(item => {
        return {
          title: item,
          index: item,
          className: 'text-center',
          type: 'number'
        }
      });
      // 计算合计数
      this.total = Object.values(zsxmData).reduce((prev: number, cur: number) => {
        return prev + cur;
      }) as number;
      this.taxByZsxmData = [zsxmData];
      // 设置G2 Bar、Pie 数据
      const data = Object.entries(zsxmData).map(item => {
        return {
          x: item[0],
          y: item[1]
        }
      }).filter(item => item.y !== 0).sort(order('y'));
      this.zsxmBarData = deepCopy(data);
      // 获取历年税收
      this.taxByYearData = resp[1].data.map(item => {
        return {
          x: item.YEAR,
          y: item.VALUE
        }
      })

    });
  }

  /**
   * 查询结果导出
   * @param e 
   */
  export(e) {

  }

}
