import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'hy-base-select',
  templateUrl: './hy-base-select.component.html',
})
export class HyBaseSelectComponent implements OnInit {
  // 所选行业依据，登记还是注册
  selectedMlmcFlag = 'SWDJ';


  public get hyBase(): string {
    return this.selectedMlmcFlag;
  }

  public set budgetValue(v) {
    this.selectedMlmcFlag = v;
  }

  constructor(private http: _HttpClient) { }

  ngOnInit() {

  }



}
