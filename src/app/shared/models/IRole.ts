/*
 * @Author: 刘硕
 * @Date: 2020-03-11 13:55:56
 * @LastEditTime: 2020-03-11 13:58:17
 * @LastEditors: Please set LastEditors
 * @Description: 角色接口类
 * @FilePath: /ng-egg/src/app/shared/models/IRole.ts
 */
export interface IRole {
  roleid: string; // 角色id
  rolename: string; // 角色名称
  remark: string;// 角色说明
  functionPermission?: any[]; // 功能权限
  dataPermission?: any[]; // 数据权限
}
