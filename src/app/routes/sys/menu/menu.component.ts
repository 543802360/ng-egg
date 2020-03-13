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
import { IMenu, array2tree } from '@shared';
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
  // 菜单树节点数据
  menuTreeData: IMenu[];
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
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  //#region 初始化与更新系统菜单导航

  updateMenus(menuData: IMenu[]) {
    const menusArray = menuData.map(item => {
      let menu;
      item.parent_id ?
        menu = {
          text: item.menuname, // 菜单名称
          key: item.menu_id,  // 菜单id
          parent_id: item.parent_id, // 父菜单id
          link: item.route_path, // 路由
          reuse: true,// 路由复用，所有菜单均使用
          group: false
        } : menu = {
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
        this.menuTreeData = array2tree(this.menuData, 'menu_id', 'parent_id', 'children');
        console.log(this.menuTreeData);
        this.menuTreeData.forEach(item => {
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
      const newMenu: IMenu = { parent_name: menu.menuname, parent_id: menu.menu_id }
      this.modalSrv.create({
        nzTitle: '新建菜单',
        nzContent: SysMenuEditComponent,
        nzComponentParams: {
          menu: newMenu
        },
        nzFooter: null
      }).afterClose.subscribe(res => {
        setTimeout(() => {
          this.initMenus();
        }, 100);
      });
    } else {
      this.modalSrv.create({
        nzTitle: '新建菜单',
        nzContent: SysMenuEditComponent,
        nzComponentParams: {
          menu
        },
        nzFooter: null
      }).afterClose.subscribe(res => {
        setTimeout(() => {
          this.initMenus();
        }, 100);
      });
    }
  }

  /**
   * 修改菜单
   * @param menu
   */
  editMenu(menu?: IMenu) {
    this.modalSrv.create({
      nzTitle: menu.menuname,
      nzContent: SysMenuEditComponent,
      nzComponentParams: {
        menu
      },
      nzFooter: null
    }).afterClose.subscribe(res => {
      setTimeout(() => {
        this.initMenus();
      }, 100);
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

  //#region table树 折叠
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
