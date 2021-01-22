import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-bdg-select',
  templateUrl: './bdg-select.component.html',
})
export class BdgSelectComponent implements OnInit {
  // 预算级次value
  _budgetValue: number[] = [1, 2, 3, 4]
  budgetNodes = [{
    title: '中央',
    value: 1,
    key: 1
  },
  {
    title: '省',
    value: 2,
    key: 2
  },
  {
    title: '市',
    value: 3,
    key: 3
  },
  {
    title: '区县',
    value: 4,
    key: 4
  }];


  public get budgetValue(): any[] {
    return this._budgetValue;
  }

  public set budgetValue(v: any[]) {
    this._budgetValue = v;
  }



  constructor(private http: _HttpClient) { }

  ngOnInit() {

  }



}
