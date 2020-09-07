import { taxZsxm } from './field';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema, SFUISchema } from '@delon/form';

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
      spanLabelFixed: 150,
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
    console.log(this.taxSchema);
  }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
