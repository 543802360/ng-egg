import { IUser, array2tree, IDepartment } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { map, filter } from 'rxjs/operators';
import { CacheService } from '@delon/cache';
import { of } from 'rxjs';

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {

  @ViewChild('sf', { static: false }) userSF: SFComponent;
  record: IUser;
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
        default: 'Y',
        enum: [{ label: '正常', value: 'Y' }, { label: '禁用', value: 'N' }],
        ui: {
          widget: 'radio',

        }
      },
      mark: {
        type: 'number',
        title: '提示',
        default: 0,
        ui: {
          widget: 'text', defaultText: '默认密码为 ：abc@123',
          grid: {
            span: 24
          },
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
      allowClear: true,
      asyncData: () => {
        return this.http.get('sys/roles').pipe(
          map(resp => {
            return resp.data.map(item => {
              return {
                label: item.rolename,
                value: item.roleid
              };
            });
          }));
      }
    },
    // 部门，异步获取
    $department_name: {
      widget: 'tree-select',
      allowClear: true,
      dropdownStyle: {
        'max-height': '300px'
      },
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
          }));
      }
    },
    $phone: {
      widget: 'string',
    },
    $mark: {
      widget: 'text',
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private cacheSrv: CacheService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (!this.record) {
      this.record = {};
      this.i = {};
      return;
    }
    if (this.record.userid) {
      this.http.get(`sys/user/${this.record.userid}`).subscribe(resp => {
        if (resp.success) {
          this.i = resp.data;
          // 设置角色默认值
          // Object.defineProperty(this.schema.properties.rolename, 'default', {
          //   configurable: true,
          //   writable: true,
          //   enumerable: true,
          //   value: this.record ? this.record.roleid : null
          // });
          // // //
          // Object.defineProperty(this.schema.properties.mark.ui, 'hidden', {
          //   configurable: true,
          //   writable: true,
          //   enumerable: true,
          //   value: true
          // });
          // Object.defineProperty(this.schema.properties.department_name, 'default', {
          //   configurable: true,
          //   writable: true,
          //   enumerable: true,
          //   value: this.record ? this.record.department_id : null
          // });
          setTimeout(() => {
            this.userSF.setValue('/rolename', this.record.roleid);
            this.userSF.setValue('/department_name', this.record.department_id);

          });

          // this.userSF.refreshSchema();

        }
      });
    }
  }

  /**
   * 保存用户；新建 or update
   * @param user
   */
  save(user: IUser) {
    const userEdited: IUser =
      { ...user, ...{ roleid: user.rolename, rolename: null }, department_id: user.department_name, department_name: null };

    if (userEdited.userid) {

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
    } else {
      Object.assign(userEdited, { creator_id: this.cacheSrv.get('userInfo', { mode: 'none' }).userid });
      this.http.post(`sys/user/create`, userEdited).subscribe(res => {
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

  }

  close() {
    this.modal.destroy();
  }
}
