import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc/table';

import { SFSchema } from '@delon/form';
import { SysRoleEditComponent } from './edit/edit.component';
import { SysRoleViewComponent } from './view/view.component';
import { IRole } from '@shared';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpParams } from '@angular/common/http';
import { StartupService } from '@core';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {

  @ViewChild('st', { static: false }) st: STComponent;
  roleData: IRole[];
  columns: STColumn[] = [
    {
      index: 'roleid',
      title: '编号',
      type: 'checkbox',
      fixed: 'left',
      width: 40
    },
    {
      title: '角色名称',
      index: 'rolename',
      className: 'text-center'
    },
    {
      title: '角色说明',
      index: 'remark',
      className: 'text-center'
    },
    {
      title: '创建时间',
      index: 'created_at',
      type: 'date',
      className: 'text-center'
    },
    {
      title: '更新时间',
      index: 'updated_at',
      type: 'date',
      className: 'text-center'
    },
    {
      title: '操作',
      className: 'text-center',
      acl: { ability: ['sys:role:edit', 'sys:role:delete'] },
      buttons:
        [
          {
            text: '编辑',
            type: 'static',
            acl: { ability: ['sys:role:edit'] },
            modal: {
              component: SysRoleEditComponent,
              params: record => ({ record }),
              modalOptions: {
                nzStyle: {
                  left: '26%',
                  position: 'fixed'
                }
              }
            },
            click: (record: STData, modal: boolean) => {
              if (modal) {
                this.startSrv.load().then(resp => { });
              }
            }
          },
          {
            text: '删除',
            type: 'del',
            acl: { ability: ['sys:role:delete'] },
            pop: {
              title: '确认删除此角色吗？',
              okType: 'danger',
              icon: 'star',
            },
            click: (record, _modal, comp) => {
              this.http.delete(`sys/roles/${record.roleid}`).subscribe(resp => {
                if (resp.success) {
                  this.msgSrv.success(resp.msg);
                  comp!.removeRow(record);
                }
                else {
                  this.msgSrv.error(resp.msg);
                };
              });

            },
          }
        ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private startSrv: StartupService) { }

  ngOnInit() {
    this.initRoles();
  }

  /**
   * 添加角色
   */
  addRole() {
    this.modal
      .createStatic(SysRoleEditComponent, { record: null }, {
        modalOptions: {
          nzStyle: {
            left: '26%',
            position: 'fixed'
          }
        }
      })
      .subscribe(res => {
        if (res) {
          // this.initRoles();
          this.initRoles();
          // this.st.reload();
        }
      });
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  refresh() {
    this.initRoles();
  }

  initRoles() {
    this.http.get('sys/roles',
      // { params: new HttpParams().set('pageNum', '1').set('pageSize', '10') }
    )
      .subscribe(resp => {
        if (resp.success) {
          // this.msgSrv.success(resp.msg);
          this.roleData = resp.data;

        } else {
          this.msgSrv.error(resp.msg);
        }
      });
  }

}
