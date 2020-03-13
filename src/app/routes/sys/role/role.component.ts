import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc/table';

import { SFSchema } from '@delon/form';
import { SysRoleEditComponent } from './edit/edit.component';
import { SysRoleViewComponent } from './view/view.component';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {
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
      buttons:
        [
          {
            text: '查看',
            type: 'static',
            modal: {
              component: SysRoleViewComponent,
              params: record => ({ record })
            },
            click: (record: STData) => {

            }
          },
          {
            text: '编辑',
            type: 'static',
            modal: {
              component: SysRoleEditComponent,
              params: record => ({ record })
            },
            click: 'load'
          },
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
