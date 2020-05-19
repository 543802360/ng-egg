import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance } from '@delon/util';
import { CacheService } from '@delon/cache';
import { yuan } from '@shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  // date
  date_range: Date[] = [];
  startDate: Date;
  endDate: Date;

  // data
  zsxmData: [] = [];
  hyData: [] = [];
  cyData: [] = [];
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
    setTimeout(() => {
      this.getTaxSummary()
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


  getTaxSummary() {
    this.budgetValue.length === 0 ? this.budgetValue = [4] : null;
    this.getTaxZsxmSummary();
    this.getTaxHySummary();
    this.getTaxCySummary();
  }

  /**
   * 获取税收 分税种信息
   */
  getTaxZsxmSummary() {
    this.http.get('analysis/tax/zsxm', this.getCondition()).subscribe(resp => {
      this.zsxmData = (resp.data).map(item => {
        return {
          x: item.ZSXMMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
      }).filter(item => item.y > 0);
    });
  }

  /**
   * 获取税收 分行业信息
   */
  getTaxHySummary() {
    this.http.get('analysis/tax/hy', this.getCondition()).subscribe(resp => {
      this.hyData = (resp.data).map(item => {
        return {
          x: item.MLMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
      }).filter(item => item.y > 0);

      this.total = this.hyData.reduce((pre, now) => (now as any).y + pre, 0);

    });
  }

  /**
   * 获取税收 分产业信息
   */
  getTaxCySummary() {
    this.http.get('analysis/tax/cy', this.getCondition()).subscribe(resp => {
      this.cyData = (resp.data).map(item => {
        return {
          x: item.CYMC,
          y: Number((item.VALUE / 10000).toFixed(2))
        }
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
    const adminCode = '3302110000';
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
