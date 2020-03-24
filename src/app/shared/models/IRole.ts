/*
 * @Author: 刘硕
 * @Date: 2020-03-11 13:55:56
 * @LastEditTime: 2020-03-11 13:58:17
 * @LastEditors: Please set LastEditors
 * @Description: 角色接口类
 * @FilePath: /ng-egg/src/app/shared/models/IRole.ts
 */
export interface IRole {
  roleid?: string; // 角色id
  rolename?: string; // 角色名称
  remark?: string;// 角色说明
  created_at?: Date; // 创建时间
  updated_at?: Date; // 更新时间
  menuIdList?: any[]; // 功能权限
  departmentIdList?: any[]; // 数据权限
}
