// import { IBDG_TOWN } from '@';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STReq, STRes, STData, STChange } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { IBDG_TOWN } from "@shared";
@Component({
  selector: 'app-budget-bdg-setting-bdg-town',
  templateUrl: './bdg-town.component.html',
})
export class BudgetBdgSettingBdgTownComponent implements OnInit, AfterViewInit {
  url = `bdg/setting/town`;
  i: IBDG_TOWN = {};
  searchSchema: SFSchema = {
    properties: {
      YEAR: {
        type: 'string',
        title: '编号'
      }
    }
  };

  selectedYear = new Date();

  params: any = { year: this.selectedYear.getFullYear() };

  res: STRes = {
    process: (data: STData[], rawData?: any) => {
      return rawData.data;
    }
  }
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '街道名称', index: 'JDXZMC', className: 'text-center' },
    { title: '预算目标（万元）', type: 'number', index: 'BDG_VALUE', className: 'text-center' },
    { title: '年度', index: 'YEAR', className: 'text-center' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
  }
  ngAfterViewInit() {

  }

  add() {

  }

  _click(e: STChange) {
    console.log(e);
    this.i = (e.click.item as any);
  }

}
