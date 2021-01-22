import { MenuType } from '../models/MenuType';

/*
 * @Author: 刘硕
 * @Date: 2020-03-11 13:45:39
 * @LastEditTime: 2020-03-11 14:42:51
 * @LastEditors: Please set LastEditors
 * @Description: 菜单接口
 * @FilePath: /ng-egg/src/app/shared/models/IMenu.ts
 */
export interface IMenu {
  menu_id?: string; // 菜单id
  parent_id?: string; // 父节点id
  parent_name?: string;
  menuname?: string; // 菜单名称
  icon?: string; // font-awesome
  menutype?: MenuType; // 菜单类型：目录、菜单
  perms?: string; // 权限
  route_path?: string; // 路由链接
  is_show?: boolean; // 菜单是否可见
  order_num?: number;// 菜单排序
  updated_at?: Date;// 更新时间
  children?: IMenu[]; // 子菜单
  parent?: IMenu; // 父菜单
  level?: number;// 菜单折叠层级
  expand?: boolean; // 是否折叠


}
