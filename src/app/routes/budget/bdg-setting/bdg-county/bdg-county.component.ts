import { taxZsxm } from './field';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema, SFUISchema } from '@delon/form';


const ZFXJJ = {
  1030146: '国有土地收益基金收入',
  // 1030146:'农业土地开发资金收入',
  // 1030146:'国有土地使用权出让收入',
  // 1030146:'城市基础设施配套费收入',
  // 1030146:'污水处理费收入',
  // 1030146:'其他政府性基金收入',

}

@Component({
  selector: 'app-budget-bdg-setting-bdg-county',
  templateUrl: './bdg-county.component.html',
  styleUrls: ['./bdg-county.component.less']
})
export class BudgetBdgSettingBdgCountyComponent implements OnInit {

  taxSchema: SFSchema = {
    properties: {}
  };

  taxUiSchema: SFUISchema = {
    '*': {
      spanLabelFixed: 200,
      grid: { span: 12, gutter: 16 },
      showRequired: true
    },
    $10100: {
      widget: 'number',
      showRequired: true
    }
  };

  constructor(private http: _HttpClient, private modal: ModalHelper) {

    Object.entries(taxZsxm).forEach(i => this.taxSchema.properties[i[0]] = { type: 'number', title: i[1] });
  }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
