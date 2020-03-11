/*
 * @Author: your name
 * @Date: 2020-03-10 16:24:46
 * @LastEditTime: 2020-03-11 14:33:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/routes/sys/menu/menu.component.ts
 */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { SysMenuEditComponent } from './edit/edit.component';
import { IMenu, array2tree } from '@shared';

@Component({
  selector
    : 'app-sys-menu',
  templateUrl: './menu.component.html',
})
export class SysMenuComponent implements OnInit, AfterViewInit {

  // 菜单数组数据
  menuData: IMenu[];
  // 菜单树节点数据
  menuTreeData: IMenu[];
  // 菜单折叠数据
  mapOfMenuExpandedData: { [menu_id: string]: IMenu[] } = {};

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

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

  initMenus() {
    this.http.get('sys/menus').subscribe(resp => {
      if (resp.success) {
        this.menuData = resp.data;
        this.menuTreeData = array2tree(this.menuData, 'menu_id', 'parent_id', 'children');

        this.menuTreeData.forEach(item => {
          this.mapOfMenuExpandedData[item.menu_id] = this.convertTreeToList(item);
        });

      } else {

      }
    });
  };
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


}
