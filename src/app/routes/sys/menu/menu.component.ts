/*
 * @Author: your name
 * @Date: 2020-03-10 16:24:46
 * @LastEditTime: 2020-03-11 14:33:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/routes/sys/menu/menu.component.ts
 */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper, MenuService } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { SysMenuEditComponent } from './edit/edit.component';
import { IMenu, array2tree, MenuType } from '@shared';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector
    : 'app-sys-menu',
  templateUrl: './menu.component.html',
})
export class SysMenuComponent implements OnInit, AfterViewInit {

  menuColumns: STColumn[] = [
    {
      title: '名称',
      index: 'menuname',
    },
    {
      title: '图标',
      index: 'icon',
      render: 'fa-custom'
    },
    {
      title: '类型',
      index: 'menutype',
    },
    {
      title: '节点路由',
      index: 'route_path',
    }, {
      title: '排序号',
      index: 'order_num',
    }
    , {
      title: '更新时间',
      index: 'updated_at',
    },
    {
      buttons: [
        {
          text: '修改',
        }
      ]
    }];

  // 菜单数组数据
  menuData: IMenu[];
  // 菜单树节点数据(表格)
  menuCollapseTreeData: IMenu[];
  // 菜单折叠数据
  mapOfMenuExpandedData: { [menu_id: string]: IMenu[] } = {};


  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
    private menuSrv: MenuService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.initMenus();
  }

  add() {
  }

  //#region 初始化与更新系统菜单导航

  updateMenus(menuData: IMenu[]) {
    const menusArray = menuData.filter(item => item.menutype !== MenuType.PERMISSION).map(item => {
      let menu;
      item.parent_id ?
        menu = {
          title: item.menuname, // 菜单名称(tree-select 用)
          text: item.menuname, // 菜单名称
          key: item.menu_id,  // 菜单id
          parent_id: item.parent_id, // 父菜单id
          link: item.route_path, // 路由
          reuse: true,// 路由复用，所有菜单均使用
          group: false
        } : menu = {
          title: item.menuname, // 菜单名称(tree-select 用)
          text: item.menuname, // 菜单名称
          key: item.menu_id,  // 菜单id
          parent_id: item.parent_id, // 父菜单id
          link: item.route_path, // 路由
          icon: item.icon,
          group: false
        };

      return menu;

    });
    const menus = array2tree(menusArray, 'key', 'parent_id', 'children');
    setTimeout(() => {
      this.menuSrv.add([
        {
          "text": "主导航",
          "group": true,
          children: menus
        }]);
    }, 500);
  }

  /**
   * 初始化菜单
   */
  initMenus() {
    this.http.get('sys/menus').subscribe(resp => {
      // 获取菜单数据集
      if (resp.success) {
        this.menuData = resp.data.map((item: IMenu) => {
          if (item.parent_id) {
            return { ...item, showExpand: false };
          } else {
            return { ...item, showExpand: true };
          }
        });

        this.menuCollapseTreeData = array2tree(this.menuData, 'menu_id', 'parent_id', 'children');
        this.menuCollapseTreeData.forEach(item => {
          this.mapOfMenuExpandedData[item.menu_id] = this.convertTreeToList(item);
        });

        this.updateMenus(resp.data);

      } else {

      }
    });
  };
  //#endregion




  //#region  菜单操作 CURD

  /**
   * 创建菜单
   * @param menu
   */
  newMenu(menu?: IMenu) {
    if (menu) {
      // 构建新菜单结构，须用Object.assign
      const newMenu = { ...menu };
      console.log('new menu :', newMenu);
      Object.defineProperties(newMenu, {
        menu_id: {
          writable: true,
          configurable: true,
          enumerable: true,
          value: null
        },
        menuname: {
          writable: true,
          configurable: true,
          enumerable: true,
          value: null
        },
        parent_name: {
          writable: true,
          configurable: true,
          enumerable: true,
          value: newMenu.menuname
        },
        parent_id: {
          writable: true,
          configurable: true,
          enumerable: true,
          value: newMenu.menu_id
        },
        parent: {
          writable: true,
          configurable: true,
          enumerable: true,
          value: menu
        },
      });
      this.modalSrv.create({
        nzTitle: '新建',
        nzContent: SysMenuEditComponent,
        nzComponentParams: {
          menu
        },
        nzFooter: null
      }).afterClose.subscribe(res => {
        res ? this.initMenus() : 'null';
      });
    } else {
      this.modalSrv.create({
        nzTitle: '新建',
        nzContent: SysMenuEditComponent,
        nzFooter: null
      }).afterClose.subscribe(res => {
        res ? this.initMenus() : null;
      });
    }
  }

  /**
   * 修改菜单
   * @param menu
   */
  editMenu(menu?: IMenu) {
    console.log(menu);
    this.modalSrv.create({
      nzTitle: menu.menuname,
      nzContent: SysMenuEditComponent,
      nzComponentParams: {
        menu,
      },
      nzFooter: null
    }).afterClose.subscribe(res => {
      res ? this.initMenus() : null;
    });
  }

  /**
   * 删除菜单
   * @param menu
   */
  deleteMenu(menu: IMenu) {
    this.modalSrv.confirm({
      nzContent: `确认删除【${menu.menuname}】吗？`,
      nzOnOk: () => {
        this.http.delete(`sys/menus/${menu.menu_id}`).subscribe(resp => {
          resp.success ?
            this.msgSrv.success(resp.msg) : this.msgSrv.error(resp.msg);
          setTimeout(() => {
            this.initMenus();
          }, 100);
        });
      }
    });
  };

  //#endregion

  //#region table树折叠 (antd example)
  collapse(array: IMenu[], data: IMenu, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.menu_id === d.menu_id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  convertTreeToList(root: IMenu): IMenu[] {
    const stack: IMenu[] = [];
    const array: IMenu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          // stack.push({ ...node.children[i], level: node.level! + 1, expand: false });
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: IMenu, hashMap: { [menu_id: string]: boolean }, array: IMenu[]): void {
    if (!hashMap[node.menu_id]) {
      hashMap[node.menu_id] = true;
      array.push(node);
    }
  }

  //#endregion


}
