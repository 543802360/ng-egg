import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc/table';

import { SFSchema } from '@delon/form';
import { SysRoleEditComponent } from './edit/edit.component';
import { SysRoleViewComponent } from './view/view.component';
import { IRole } from '@shared';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {

  @ViewChild('st', { static: false }) st: STComponent;
  roleData: IRole[];
  columns: STColumn[] = [
    {
      title: '角色名称',
      index: 'rolename'
    },
    {
      title: '角色说明',
      index: 'remark'
    },
    {
      title: '更新时间',
      index: 'updated_at',
      render: 'updateAt-row'
    },
    {
      title: '操作',
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
            click: (record: STData) => {

            }
          },
        ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.initRoles();
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  initRoles() {
    this.http.get('sys/roles',
      { params: new HttpParams().set('pageNum', '1').set('pageSize', '10') })
      .subscribe(resp => {

        if (resp.success) {
          this.msgSrv.success(resp.msg);
          this.roleData = resp.data;

        } else {
          this.msgSrv.error(resp.msg);
        }
      });
  }

}
