import { map } from 'rxjs/operators';
import { IRole, array2tree, IMenu, MenuType } from '@shared';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ArrayService } from '@delon/util';
import { NzTreeComponent, NzTreeBase } from 'ng-zorro-antd';

@Component({
  selector: 'app-sys-role-edit',
  templateUrl: './edit.component.html',
})
export class SysRoleEditComponent implements OnInit {
  //
  @ViewChild('sf', { static: false }) roleSf: SFComponent;
  menusTreeNodes = [];
  menusArray: IMenu[];
  record: IRole = {};
  i: IRole;
  // role schema
  schema: SFSchema = {
    properties: {
      rolename: { type: 'string', title: '角色名称' },
      remark: { type: 'string', title: '角色说明' },
      menuIdList: { type: "string", title: '功能权限' },
      departmentIdList: { type: 'string', title: '数据权限' },
    },
    required: ['rolename'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $rolename: {
      widget: 'string'
    },
    $remark: {
      widget: 'string',
    },
    $menuIdList: {
      widget: 'tree-select',
      checkable: true,
      multiple: true,
      showLine: false,
      allowClear: true,
      asyncData: () => {
        return this.http.get('sys/menus').pipe(
          map(resp => {
            const node = resp.data.map(item => {
              return {
                title: item.menuname,
                key: item.menu_id,
                parent_id: item.parent_id,
                parent_name: item.parent_name
              };
            });
            this.menusArray = resp.data;
            const nodes = array2tree(node, 'key', 'parent_id', 'children');
            this.menusTreeNodes = nodes;
            return nodes;
          }));
      }
    },
    $departmentIdList: {
      widget: 'tree-select',
      checkable: true,
      showLine: false,
      allowClear: true,
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

    }

  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private arraySrv: ArrayService,
    public http: _HttpClient,

  ) { }

  ngOnInit(): void {
    if (this.record && this.record.roleid) {
      this.http.get(`sys/roles/${this.record.roleid}`).subscribe(res => (this.i = res.data));
    } else {
      this.i = {};
    }
  }

  /**
   * 保存角色
   * @param role :角色
   */
  save(role: IRole) {
    // 处理菜单权限
    if (role.menuIdList.length) {
      const menuIdList = this.processPermMenus(role.menuIdList);
      Object.assign(role, { menuIdList });
    }
    console.log(role);
    if (role.roleid) {
      this.http.put(`sys/roles/${role.roleid}`, role).subscribe(res => {
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
      this.http.post(`sys/roles`, role).subscribe(res => {
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

  processPermMenus(menuList: string[]) {
    const result = [];
    let children = [];
    let parents = [];
    // 递归获取子节点
    const getChildrenNodes = (array, sourceId, parentIdMapName, idMapName) => {
      for (const item of array) {
        if (item[parentIdMapName] === sourceId) {
          console.table(item);
          children.push(item[idMapName]);
          getChildrenNodes(array, item[idMapName], parentIdMapName, idMapName);
        } else {
          continue;
        }
      }
    };
    // 递归获取所有父节点
    const getParentNodes = (array, sourceId, parentIdMapName, idMapName) => {
      for (const item of array) {
        if (item[idMapName] === sourceId) {
          if (item[parentIdMapName]) {
            parents.push(item[parentIdMapName]);
            getParentNodes(array, item[parentIdMapName], parentIdMapName, idMapName);
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    };

    /**
    * 主要是为了nz-tree的显示逻辑进行菜单的递归
     */
    menuList.forEach(id => {
      this.menusArray.forEach(item => {
        if (item.menu_id === id) {
          // console.log(item);
          // 判断菜单类型
          switch (item.menutype) {
            // 如果是一级目录，则获取所有子节点并添加至角色对应菜单权限
            case MenuType.DIR:
              children = [];
              getChildrenNodes(this.menusArray, item.menu_id, 'parent_id', 'menu_id');
              result.push(item.menu_id, ...children);
              break;
            // 如果是菜单，则需添加其父节点和子节点
            case MenuType.MENU:
              children = [];
              parents = [];
              getChildrenNodes(this.menusArray, item.menu_id, 'parent_id', 'menu_id');
              // getParentNodes(this.menusArray, item.menu_id, 'parent_id', 'menu_id');
              result.push(item.menu_id, ...children, ...parents);
              break;
            // 添加该节点及所有父节点
            case MenuType.PERMISSION:
              parents = [];
              // getParentNodes(this.menusArray, item.menu_id, 'parent_id', 'menu_id');
              result.push(item.menu_id, ...parents);
              break;

            default:
              break;
          }

        }
      });
    });
    // 菜单去重
    return Array.from(new Set(result));
  };



  close() {
    this.modal.destroy();
  }
}
