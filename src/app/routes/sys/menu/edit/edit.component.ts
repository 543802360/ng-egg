import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { IMenu, array2tree } from '@shared';
import { delay, map } from 'rxjs/operators';


@Component({
  selector: 'app-sys-menu-edit',
  templateUrl: './edit.component.html',
})
export class SysMenuEditComponent implements OnInit {

  // 菜单
  @Input() menu: IMenu = {};
  // 菜单表单json schema定义
  schema: SFSchema = {
    properties: {
      menuname: {
        type: 'string',
        title: '菜单名称'
      },
      parent_name: {
        type: 'string',
        title: '上级菜单',
        enum: [
          { title: '一级菜单', key: '' }
        ]
      },
      route_path: {
        type: 'string',
        title: '节点路由'
      },
      // menutype: {
      //   type: 'string',
      //   title: '节点类型',
      //   enum: [
      //     { label: '目录', value: 'DIR' },
      //     {
      //       label: '菜单', value: 'MENU',
      //     }
      //   ]
      // },
      icon: {
        type: 'string',
        title: '节点图标'
      },
      order_num: {
        type: 'number',
        title: '排序号'
      },
    },
    required: ['menuname'],
  };
  // 表单ui定义
  ui: SFUISchema = {

    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $menuname: {
      widget: 'string'
    },
    $parent_id: {
      widget: 'string',
    },
    $parent_name: {
      widget: 'tree-select',
      multiple: false,
      asyncData: () => {
        return this.http.get('sys/menus').pipe(
          map(resp => {
            const menuData = resp.data.map((menu: IMenu) => {
              return { title: menu.menuname, 'key': menu.menu_id, 'parent_id': menu.parent_id };

            });
            return array2tree(menuData, 'key', 'parent_id', 'children');
          })
        );
      }
    },
    $order_num: {
      widget: 'number',
      grid: {
        span: 24
      }
    },

  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    // if (this.record.id > 0)
    //   this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  /**
   * 保存修改菜单
   * @param menu
   */
  save(menu: IMenu) {
    if (menu.menu_id) {
      // 更新
      this.http.put(`sys/menus/${menu.menu_id}`, menu).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    } else {
      // 创建
      this.http.post(`sys/menus`, menu).subscribe(resp => {
        this.success(resp);
      }, error => {

      });
    }
  }

  close() {
    this.modal.destroy();
  }

  /**
   * 菜单保存成功响应处理
   * @param resp :http response
   */
  success(resp) {
    if (resp.success) {
      setTimeout(() => {
        this.close();
      });
      this.msgSrv.success(resp.msg, { nzDuration: 4000 });
    } else {
      this.msgSrv.error(resp.msg, { nzDuration: 4000 });
    }
  }
}
