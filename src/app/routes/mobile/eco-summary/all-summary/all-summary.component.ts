import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingService } from '@delon/abc';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-eco-summary-all-summary',
  templateUrl: './all-summary.component.html',
  styleUrls: ['./all-summary.component.less']
})
export class EcoSummaryAllSummaryComponent implements OnInit, AfterViewInit {
  date: Date;
  url = `analysis/tax/czsr`;
  ybggyssrTotal; //一般公共预算收入总额 
  ybggyssrBtq; //比同期
  taxTotal;
  notaxTotal;
  taxZsxmData: any[] = [];
  notaxZsxmData: any[] = [];
  taxVisible = false;
  notaxVisible = false;

  constructor(private http: _HttpClient, private loadSrv: LoadingService) {
    this.date = new Date();
  }

  ngOnInit() { }
  ngAfterViewInit() {
    this.getData();
  }

  getData() {
    this.loadSrv.open({ text: '正在加载' });
    const date = this.formatIt(this.date, 'YYYY-MM');
    const $stream = this.http.get(this.url, { date });

    $stream.subscribe(resp => {
      this.loadSrv.close();
      console.log(resp.data);

      const data = resp.data;
      const taxObj = data.filter(i => i.kmdm === '101')[0];
      const notaxObj = data.filter(i => i.kmdm === '103')[0];
      this.taxTotal = Number(taxObj['bn']);
      this.notaxTotal = Number(notaxObj['bn']);

      this.taxZsxmData = data.filter(i => i.sjkmdm === '101');
      this.notaxZsxmData = data.filter(i => i.sjkmdm === '103');

      console.log('税收：', this.taxZsxmData);
      console.log('非税：', this.notaxZsxmData);


      this.taxVisible = true;
      this.ybggyssrTotal = Math.round((Number(taxObj.bn) + Number(notaxObj.bn)) * 100) / 100;
      const sntq = Number(taxObj.sn) + Number(notaxObj.sn);
      this.ybggyssrBtq = Math.round((this.ybggyssrTotal / sntq - 1) * 10000) / 100


    });

  }

  itemChange(e) {
    let { selectedIndex, value } = e;
    console.log(selectedIndex, value);
    switch (value) {

      case '税收收入':
        this.taxVisible = true;
        this.notaxVisible = false;
        break;
      case '非税收入':
        this.taxVisible = false;
        this.notaxVisible = true;
        break;

      default:
        break;
    }
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

  onOk(result: Date) {
    this.date = result;
    setTimeout(() => {
      this.getData();
    });
  }

  formatIt(date: Date, form: string) {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (form === 'YYYY-MM-DD') {
      return dateStr;
    }
    if (form === 'HH:mm') {
      return timeStr;
    }
    if (form === 'YYYY-MM') {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
    }
    return `${dateStr} ${timeStr}`;
  }

}
