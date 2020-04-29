import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { LoadingService } from '@delon/abc';

import { IDepartment, IUser, array2tree, tree2array } from '@shared';
import { NzMenuDirective, NzContextMenuService, NzFormatEmitEvent, NzModalService, NzTreeNode, NzMessageService, NzTreeComponent } from 'ng-zorro-antd';
// import { SysDepartmentComponent } from '../log/department/department.component';
import { map } from 'rxjs/operators';
import { SysDepartmentEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-sys-department',
  templateUrl: './department.component.html',
})
export class SysDepartmentComponent implements OnInit {
  @ViewChild('departmentTree') departmentTree: NzTreeComponent;
  // 部门树节点s
  departmentTreeNodes: any[] = [];
  // 右键选中treenode
  selectedNode: NzTreeNode;
  // 拖拽
  dragEnabled = false;
  isDraged = false;
  i: IDepartment;
  constructor(
    public http: _HttpClient,
    public loadingSrv: LoadingService,
    public modalSrv: NzModalService,
    public modal: ModalHelper,
    public contextSrv: NzContextMenuService,
    public msgSrv: NzMessageService
  ) { }

  ngOnInit() {
    this.initDepartmentTree();
  }

  //#region 部门操作


  /**
   * 初始化部门树
   */
  initDepartmentTree() {
    this.loadingSrv.open();
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
      this.loadingSrv.close();
    });
  }

  /**
   * 添加部门节点
   * @param root :是否为根节点
   */
  addDepartment(root?: string) {
    const parent = root ? { parent_id: '', parent_name: '' } : { parent_id: this.selectedNode.key, parent_name: this.selectedNode.title };
    this.modalSrv.create({
      nzTitle: '新建部门',
      nzContent: SysDepartmentEditComponent,
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
        nzContent: SysDepartmentEditComponent,
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
      nzContent: `确认删除【${this.selectedNode.title}】吗？`,
      nzOnOk: () => {
        this.http.delete(`sys/departments/${this.selectedNode.key}`).subscribe(resp => {
          resp.success ?
            this.msgSrv.success(resp.msg) : this.msgSrv.error(resp.msg);
          setTimeout(() => {
            this.initDepartmentTree();
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
    this.http.get(`sys/departments/${e.node.key}`).subscribe(resp => {
      if (resp.success) {
        this.i = resp.data;
      }
    }, error => { });
  };

  /**
   * 部门保存
   */
  departmentSaved() {
    this.http.put(`sys/departments/${this.i.department_id}`, this.i).subscribe(resp => {
      if (resp.success) {
        this.msgSrv.success(resp.msg);
      } else {
        this.msgSrv.error(resp.msg);
      }
    }, error => {

    });
  }

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
