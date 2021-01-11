import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BudgetLevel } from '@shared';
import { ToastService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'mobile-drawer-condition',
  templateUrl: './drawer-condition.component.html',
  styleUrls: ['./drawer-condition.component.less']
})
export class MobileDrawerConditionComponent implements OnInit {
  // 是否打开drawer
  state = {
    open: true
  };
  // 时间及预算级次选择
  startTime: Date;
  endTime: Date;
  countySelected = true;
  citySelected = false;
  centerSelected = false;

  budgetValue = [];

  height: number = document.documentElement.clientHeight - 145;

  @Output() onConditionConfirm = new EventEmitter<Object>();

  constructor(private http: _HttpClient,
    private toastSrv: ToastService) {

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    this.startTime = new Date(year, 0);
    this.endTime = new Date(year, month);
  }

  ngOnInit() { }

  clearBdgValue() {
    this.budgetValue = [];
  }

  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  onOk() {
    this.budgetValue = [];
    if (this.countySelected || this.citySelected || this.centerSelected) {
      if (this.centerSelected) {
        this.budgetValue.push(BudgetLevel.CENTER);
      }
      if (this.citySelected) {
        this.budgetValue.push(BudgetLevel.CITY);
      }
      if (this.countySelected) {
        this.budgetValue.push(BudgetLevel.COUNTY);
      }
      //获取参数
      const year = this.startTime.getFullYear();
      const startMonth = this.startTime.getMonth() + 1;
      const endMonth = this.endTime.getMonth() + 1;
      const budgetValue = this.budgetValue.toLocaleString();
      const flag = 'DZSP';
      // 传递参数
      this.onConditionConfirm.emit({
        year: year - 1,
        startMonth, endMonth, flag, budgetValue
      })
    } else {
      this.toastSrv.info('请选择预算级次！！');
    }
  }
}
