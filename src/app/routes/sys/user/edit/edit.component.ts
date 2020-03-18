import { IUser, array2tree, IDepartment } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  record: IUser = {};
  i: any;
  schema: SFSchema = {
    properties: {
      // photo: {
      //   type: 'string',
      //   title: '头像'
      // },
      name: {
        type: 'string',
        title: '姓名',
      },
      username: {
        type: 'string',
        title: '用户名'
      },
      rolename: {
        type: 'string',
        title: '角色',
      },
      department_name: {
        type: 'string',
        title: '部门',
      },
      phone: {
        type: 'string',
        format: "mobile",
        title: '手机',
      },
      email: {
        type: 'string',
        format: 'email',
        title: '邮箱',
      },
      is_login: {
        type: 'string',
        title: '用户状态',
        enum: [{ label: '正常', value: 'Y' }, { label: '禁用', value: 'N' }],
        ui: {
          widget: 'radio',

        }
      }
    },
    required: ['name', 'username', 'rolename', 'department_name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $name: {
      widget: 'string',

    },
    $username: {
      widget: 'string',

    },
    // 角色，异步获取数据，通过pipe map操作符转换数据
    $rolename: {
      widget: 'select',
      asyncData: () => {
        return this.http.get('sys/roles').pipe(
          map(resp => {
            return resp.data.map(item => {
              return {
                label: item.rolename,
                value: item.roleid
              };
            });
          }))
      }
    },
    // 部门，异步获取
    $department_name: {
      widget: 'tree-select',
      asyncData: () => {
        return this.http.get('sys/departments').pipe(
          map(resp => {
            const node = resp.data.map(item => {
              return {
                title: item.department_name,
                key: item.department_id,
                parent_id: item.parent_id,
                parent_name: item.parent_name
              };
            });

            return array2tree(node, 'key', 'parent_id', 'children');
          }))
      }
    },
    $phone: {
      widget: 'string',
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    console.log('user edit ', this.record);
    if (this.record.userid) {
      this.http.get(`sys/user/${this.record.userid}`).subscribe(resp => {
        if (resp.success) {
          this.i = resp.data;
        }
      });
    }
  }

  save(user: IUser) {
    const userEdited =
      { ...user, ...{ roleid: user.rolename, rolename: null }, department_id: user.department_name, department_name: null };
    this.http.post(`sys/user/update`, userEdited).subscribe(res => {
      if (res.success) {
        this.msgSrv.success(res.msg);
      } else {
        this.msgSrv.error(res.msg);

      }
      this.modal.close(true);
      // this.msgSrv.success('保存成功');
      // this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
