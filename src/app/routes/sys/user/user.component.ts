import { SysUserEditComponent } from './edit/edit.component';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData, STChange } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { IDepartment, IUser, array2tree, tree2array } from '@shared';
import { NzMenuDirective, NzContextMenuService, NzFormatEmitEvent, NzModalService, NzTreeNode, NzMessageService, NzTreeComponent } from 'ng-zorro-antd';
import { SysDepartmentComponent } from '../department/department.component';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class SysUserComponent implements OnInit {

  @ViewChild('departmentTree', { static: false }) departmentTree: NzTreeComponent;
  // 部门树节点s
  departmentTreeNodes: any[] = [];
  // 右键选中treenode
  selectedNode: NzTreeNode;
  // 拖拽
  dragEnabled = false;
  isDraged = false;

  // 用户表操作
  userData: IUser[];
  userEditVisible = true;
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
      title: '操作', fixed: 'right', width: 180, className: 'text-center',

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
          // click: 'reload',
          click: (_record, modal) => {
            // modal 为回传值，可自定义回传值
            modal ? this.initUsers() : null;
          }
        },
        // { text: '转移' },
        {
          text: '删除',
          type: 'del',
          acl: 'ability.sys:user:delete',
          pop: {
            title: '确认删除此用户吗？',
            okType: 'danger',
            icon: 'star',
          },
          click: (record, _modal, comp) => {
            this.http.post('sys/user/destroy', record).subscribe(resp => {
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
    private http: _HttpClient,
    private modalSrv: NzModalService,
    private modal: ModalHelper,
    private contextSrv: NzContextMenuService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.initDepartmentTree();
    this.initUsers();
  }

  //#region 用户操作


  initUsers() {
    this.http.get('sys/user/list').subscribe(resp => {
      console.log(resp);
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

  }

  editUser() {

  }

  userChange(e: STChange) {
    // console.log('change', e);
    if (e.type === "checkbox" && e.checkbox.length) {
      this.userEditVisible = false;
    } else if (e.type === "checkbox" && !e.checkbox.length) {
      this.userEditVisible = true;
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
   * 添加部门节点
   * @param root :是否为根节点
   */
  addDepartment(root?: string) {
    const parent = root ? { parent_id: '', parent_name: '' } : { parent_id: this.selectedNode.key, parent_name: this.selectedNode.title };
    this.modalSrv.create({
      nzTitle: '编辑部门',
      nzContent: SysDepartmentComponent,
      nzComponentParams: {
        record: parent
      },
      nzFooter: null
    }).afterClose.subscribe(res => {
      res ? this.initDepartmentTree() : null;
    });

  }

  /**
   * 编辑部门节点
   */
  editDepartment() {
    const record = this.selectedNode.parentNode ?

      {
        parent_id: this.selectedNode.parentNode.key,
        parent_name: this.selectedNode.parentNode.title,
        department_id: this.selectedNode.key,
        department_name: this.selectedNode.title
      } :
      {
        parent_id: '',
        parent_name: '',
        department_id: this.selectedNode.key,
        department_name: this.selectedNode.title
      };
    if (this.selectedNode) {
      const modal = this.modalSrv.create({
        nzTitle: '编辑部门',
        nzContent: SysDepartmentComponent,
        nzComponentParams: {
          record
        },
        nzFooter: null
      }).afterClose.subscribe(res => {
        res ? this.initDepartmentTree() : null;
      });
    }
  }

  /**
   * 删除部门
   */
  deleteDepartment() {
    this.modalSrv.warning({
      nzTitle: '提示',
      nzContent: `确认删除【${this.selectedNode.title}】吗？该操作会删除部门下的所有用户，是否确认？`,
      nzOnOk: () => {
        this.http.delete(`sys/departments/${this.selectedNode.key}`).subscribe(resp => {
          resp.success ?
            this.msgSrv.success(resp.msg) : this.msgSrv.error(resp.msg);
          setTimeout(() => {
            this.initDepartmentTree();
            this.initUsers();
          });
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
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
  /**
   * 拖拽完成事件
   * @param e
   */
  departmentDragEnd(e) {
    this.isDraged = true;
  }
  /**
   * 刷新部门组织架构
   */
  refreshDepartment() {
    this.initDepartmentTree();
  }
  /**
   * 确认拖拽排序
   */
  confirmDrag() {
    this.dragEnabled = !this.dragEnabled;
    if (!this.isDraged) {
      return;
    }
    // console.log(this.departmentTree.getTreeNodes());
    // 拷贝部门树节点，并转换为扁平数组形式
    const orderedNodes = tree2array(Object.values({ ...this.departmentTree.getTreeNodes() }), 'key', 'title', 'parentNode').map(item => {
      return {
        department_id: item.id,
        department_name: item.name,
        parent_id: item.parent_id,
        parent_name: item.parent_name
      }
    });
    this.http.post('sys/departments/updateAll', orderedNodes)
      .pipe(map(resp => {
        resp.success ? this.msgSrv.success(resp.msg) : this.msgSrv.error(resp.msg);
      }))
      .subscribe(resp => {
        setTimeout(() => {
          this.initDepartmentTree();
        });
      }, error => {
        this.msgSrv.error(error);
      });
  }
  /**
   * 取消拖拽排序
   */
  cancelDrag() {
    this.dragEnabled = !this.dragEnabled;
    if (!this.isDraged) {
      return;
    }
    this.initDepartmentTree();
  }
  //#endregion




}
