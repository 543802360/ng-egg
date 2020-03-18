import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { IDepartment, array2tree, tree2array } from '@shared';
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
  dragEnabled = false;
  isDraged = false;

  constructor(
    private http: _HttpClient,
    private modalSrv: NzModalService,
    private contextSrv: NzContextMenuService,
    private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.initDepartmentTree();
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

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
    this.modalSrv.confirm({
      nzContent: `确认删除【${this.selectedNode.title}】吗？`,
      nzOnOk: () => {
        this.http.delete(`sys/departments/${this.selectedNode.key}`).subscribe(resp => {
          resp.success ?
            this.msgSrv.success(resp.msg) : this.msgSrv.error(resp.msg);
          setTimeout(() => {
            this.initDepartmentTree();
          });
        });
      }
    });
  }

  /**
   * 部门树节点单击
   * @param e
   */
  departmentSelected(e) {
    console.log(e);
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
    console.log('ordered tree nodes：', orderedNodes);

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

  addUser() {

  }
}
