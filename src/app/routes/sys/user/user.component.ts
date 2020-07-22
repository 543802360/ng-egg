import { SysUserEditComponent } from './edit/edit.component';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STChange, STData, STColumnButton } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { IDepartment, IUser, array2tree, tree2array } from '@shared';
import { NzMenuDirective, NzContextMenuService, NzFormatEmitEvent, NzModalService, NzTreeNode, NzMessageService, NzTreeComponent } from 'ng-zorro-antd';
// import { SysDepartmentComponent } from '../log/department/department.component';
import { map } from 'rxjs/operators';
import { CacheService } from '@delon/cache';
@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class SysUserComponent implements OnInit {

  @ViewChild('departmentTree') departmentTree: NzTreeComponent;
  // 部门树节点s
  departmentTreeNodes: any[] = [];
  // 右键选中treenode
  selectedNode: NzTreeNode;

  // 用户表操作
  userData: IUser[];
  userEditDisabled = true;
  userSelected: IUser[];
  userColumns: STColumn[] = [
    {
      index: 'userid',
      title: '编号',
      type: 'checkbox',
      fixed: 'left',
      width: 40
    },
    // { title: '头像', index: 'photo', type: 'img', fixed: 'left', width: 100, className: 'text-center' },
    { title: '用户名', index: 'username', fixed: 'left', width: 100, className: 'text-center' },
    { title: '姓名', index: 'name', fixed: 'left' },

    { title: '部门', index: 'department_name', className: 'text-center' },
    { title: '角色', index: 'rolename', className: 'text-center' },
    { title: '手机号码', index: 'phone', className: 'text-center' },
    { title: '邮箱', index: 'email', className: 'text-center' },
    {
      title: '状态', index: 'is_login', type: 'tag', className: 'text-center',
      render: 'login_status'
    },
    { title: '创建时间', index: 'created_at', type: 'date', className: 'text-center' },
    { title: '更新时间', index: 'updated_at', type: 'date', className: 'text-center' },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      className: 'text-center',
      acl: { ability: ['sys:user:add', 'sys:user:delete'] },
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          acl: { ability: ['sys:user:edit'] },
          modal: {
            component: SysUserEditComponent,
            params: record => ({ record }),
            modalOptions: {
              nzStyle: {
                left: '26%',
                position: 'fixed'
              }
            }
          },
          //
          click: (_record, modal, comp) => {
            // modal 为回传值，可自定义回传值
            modal ? this.initUsers() : null;
          }
        },
        // { text: '转移' },
        {
          text: '删除',
          type: 'del',
          iif: (item: STData,
            btn: STColumnButton,
            column: STColumn) => {
            return this.cacheSrv.get('userInfo', { mode: 'none' }).userid === item.userid ? false : true;
          },
          iifBehavior: 'hide',
          acl: { ability: ['sys:user:delete'] },
          pop: {
            title: '确认删除此用户吗？',
            okType: 'danger',
            icon: 'star',
          },
          click: (record, _modal, comp) => {
            this.http.post('sys/user/destroy', [record.userid]).subscribe(resp => {
              if (resp.success) {
                this.msgSrv.success(`成功删除用户${record.username}`);
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
  userSearchSchema: SFSchema = {
    properties: {
      username: {
        type: 'string',
      }
    }
  };
  constructor(
    public http: _HttpClient,
    public modalSrv: NzModalService,
    public modal: ModalHelper,
    public cacheSrv: CacheService,
    public contextSrv: NzContextMenuService,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.initDepartmentTree();
    this.initUsers();
  }

  //#region 用户操作


  initUsers() {
    this.http.get('sys/user/list').subscribe(resp => {
      this.userData = resp.data;
    });
  }

  addUser() {
    this.modal
      .createStatic(SysUserEditComponent, { record: null }, {
        modalOptions: {
          nzStyle: {
            left: '26%',
            position: 'fixed'
          }
        }
      })
      .subscribe(res => {
        if (res) {
          this.initUsers();
        }
      });
  }

  deleteUser() {

    this.modalSrv.warning({
      nzTitle: '提示',
      nzContent: '确认删除所选用户吗？',
      nzOnOk: () => {
        const userids = this.userSelected.map(item => item.userid);
        this.http.post('sys/user/destroy', userids).subscribe(resp => {
          if (resp.success) {
            this.msgSrv.success(resp.msg);
            this.initUsers();
          }
          else {
            this.msgSrv.error(resp.msg);
          };
        });
      },
      nzCancelText: '取消'
    });

  }

  editUser() {

  }

  userChange(e: STChange) {
    if (e.type === "checkbox" && e.checkbox.length) {
      this.userEditDisabled = false;
      this.userSelected = e.checkbox as any;
    } else if (e.type === "checkbox" && !e.checkbox.length) {
      this.userEditDisabled = true;
    }
  }

  //#endregion

  //#region 部门操作

  /**
    * 初始化部门树
    */

  initDepartmentTree() {
    this.http.get('sys/departments').subscribe(resp => {
      const menuData = resp.data.map((dpartment: IDepartment) => {
        return {
          title: dpartment.department_name,
          'key': dpartment.department_id,
          'parent_id': dpartment.parent_id,
          'parent_name': dpartment.parent_name
        };
      });
      this.departmentTreeNodes = array2tree(menuData, 'key', 'parent_id', 'children');
    });
  }

  /**
   * 部门树节点单击
   * @param e
   */
  departmentSelected(e: NzFormatEmitEvent) {
    this.http.get(`sys/user/getUsersByDepartmentId/${e.node.key}`).subscribe(resp => {
      if (resp.success) {
        this.userData = resp.data;
      }
    }, error => { });
  };
  /**
   * 组织架构树右键菜单
   * @param e
   */
  deprtmentCtxMenu(e: NzFormatEmitEvent, menu) {
    console.log(e);
    this.selectedNode = e.node;
    this.contextSrv.create(e.event, menu);
    // this.departMenu.elementRef.nativeElement
  }


  //#endregion




}
