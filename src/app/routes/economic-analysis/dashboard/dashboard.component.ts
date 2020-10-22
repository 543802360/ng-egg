import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getTimeDistance } from '@delon/util';
import { CacheService } from '@delon/cache';
import { yuan, order } from '@shared';
import { G2PieData } from '@delon/chart/pie';
import { forkJoin } from 'rxjs';
import { G2BarData } from '@delon/chart/bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // date
  date_range: Date[] = [];
  startDate: Date;
  endDate: Date;

  // data
  zsxmData: G2BarData[] = [];
  hyData: G2PieData[];
  cyData: G2PieData[];
  total: number;

  //#region 预算级次
  budgetValue: number[] = [4]
  budgetNodes = [{
    title: '中央级',
    value: 1,
    key: 1
  },
  {
    title: '市级',
    value: 3,
    key: 3
  },
  {
    title: '区县级',
    value: 4,
    key: 4
  }];

  //#endregion
  constructor(private http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private cacheSrv: CacheService
  ) {
    const date = new Date();
    this.startDate = new Date(date.getFullYear(), 0);
    this.endDate = date;

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.getTaxSummary();
    });
  }

  /**
   * 设置日期
   * @param type: 时间段类型
   * @param flag
   */
  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    this.startDate = this.date_range[0];
    this.endDate = this.date_range[1];
    setTimeout(() => this.cdr.detectChanges());
  }


  /**
   * 获取税收统计概况（电子税票）
   */
  getTaxSummary() {
    this.budgetValue.length === 0 ? this.budgetValue = [4] : null;
    // 行业税收
    const $taxHySummary = this.http.get('analysis/tax/hy', this.getCondition());
    // 
    const $taxCySummary = this.http.get('analysis/tax/cy', this.getCondition());
    const $taxZsxmSummary = this.http.get('analysis/tax/zsxm', this.getCondition());

    forkJoin([$taxHySummary, $taxCySummary, $taxZsxmSummary]).subscribe(resp => {

      const hyPieData = (resp[0].data).map(item => {
        return {
          x: item.MLMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
      }).sort(order('y'));

      const cyPieData = (resp[1].data).map(item => {
        return {
          x: item.CYMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
      }).sort(order('y'));

      this.zsxmData = (resp[2].data).map(item => {
        return {
          x: item.ZSXMMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
      }).filter(item => item.y !== 0).sort(order('y'));


      setTimeout(() => {
        this.hyData = hyPieData;
        this.cyData = cyPieData;
        this.total = this.hyData.reduce((pre, now) => (now as any).y + pre, 0);

      });

    });
  }
  /**
   * 获取查询条件参数
   */
  getCondition() {
    const year = this.startDate.getFullYear();
    const startMonth = this.startDate.getMonth() + 1;
    const endMonth = this.endDate.getMonth() + 1;
    const budgetValue = this.budgetValue.toLocaleString();
    const adminCode = '3302130000';
    // const adminCode = this.cacheSrv.get('userInfo', { mode: 'none' }).department_id;

    return { adminCode, year, startMonth, endMonth, budgetValue };
  }
  /**
   * G2 PIE 图表tooltip
   * @param value
   */
  handlePieValueFormat(value: any) {
    return yuan(value);
  }
}
