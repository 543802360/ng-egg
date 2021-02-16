import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BudgetLevel } from '@shared';
import { ToastService } from 'ng-zorro-antd-mobile';
const MLMC = [
  "",
  "制造业",
  "房地产业",
  "建筑业",
  "金融业",
  "批发和零售业",
  "交通运输、仓储和邮政业",
  "住宿和餐饮业",
  "农、林、牧、渔业",
  "教育",
  "文化、体育和娱乐业",
  "信息传输、软件和信息技术服务业",
  "租赁和商务服务业",
  "科学研究和技术服务业",
  "水利、环境和公共设施管理业",
  "电力、热力、燃气及水生产和供应业",
  "居民服务、修理和其他服务业",
  "卫生和社会工作",
  "公共管理、社会保障和社会组织",
  "采矿业",
  "国际组织",
  "税务管理特定行业"
];
@Component({
  selector: 'qypm-condition',
  templateUrl: './qypm-condition.component.html',
  styleUrls: ['./qypm-condition.component.less']
})
export class MobileQypmConditionComponent implements OnInit {
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

  //门类选择
  mlmcData = MLMC;
  selectedMlmc = '';
  selectedMlmcArray = [];

  //税收名次选择
  sspmData = [10, 50, 100, 200, 500, 1000, 2000];
  selectedNum = 100;
  selectedNumArray = [];

  height: number = document.documentElement.clientHeight - 145;
  // 发送参数
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
    this.state.open = false;
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
      /**
       * 
        adminCode: 3302060000
        year: 2021
        startMonth: 1
        endMonth: 2
        budgetValue: 1,3,4
        count: 100
        hyBase: SWDJ
        mlmc: 制造业
       */
      //获取参数
      const year = this.startTime.getFullYear();
      const startMonth = this.startTime.getMonth() + 1;
      const endMonth = this.endTime.getMonth() + 1;
      const budgetValue = this.budgetValue.toLocaleString();
      const flag = 'DZSP';


      if (this.selectedMlmc) {
        this.onConditionConfirm.emit({
          year: year,
          count: this.selectedNum,
          hyBase: 'SWDJ',
          mlmc: this.selectedMlmc,
          startMonth, endMonth, budgetValue
        })
      } else {
        this.onConditionConfirm.emit({
          year: year,
          count: this.selectedNum,
          startMonth, endMonth, budgetValue
        });
      }
    } else {
      this.toastSrv.info('请选择预算级次！！');
    }
  }

  /**
* 
* @param result ：门类名称选择函数
*/
  onSelectMlmc(result) {
    let value = [];
    let temp = '';
    result.forEach(item => {
      value.push(item.label || item);
      temp += item.label || item;
    });
    this.selectedMlmc = value.map(v => v).join(',');

  }

  /**
  * 
  * @param result ：门类名称选择函数
  */
  onSelectNum(result) {
    let value = [];
    let temp = '';
    result.forEach(item => {
      value.push(item.label || item);
      temp += item.label || item;
    });
    this.selectedNum = value.map(v => v).join(',') as any;
  }
}
