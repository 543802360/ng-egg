import { Component, OnInit, ViewChild as % if (!!viewEncapsulation) { %>, ViewEncapsulation <% }%> as % if (changeDetection !== 'Default') { %>, ChangeDetectionStrategy <% }%> } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.component.html',<% if (!inlineStyle) { %> as % } else { %>
    styleUrls: ['./<%= dasherize(name) %>.component.<%= style %>'] <% } %> as % if (!!viewEncapsulation) { %>,
      encapsulation: ViewEncapsulation.<%= viewEncapsulation %> as % } if (changeDetection !== 'Default') { %>,
        changeDetection: ChangeDetectionStrategy.<%= changeDetection %> as % } %>
})
export class <%= componentName %> implements OnInit {
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
