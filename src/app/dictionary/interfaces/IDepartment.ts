/*
 * @Author: your name
 * @Date: 2020-03-11 13:56:04
 * @LastEditTime: 2020-03-11 14:00:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/shared/models/IDepartment.ts
 */
export interface IDepartment {
  department_id?: string; // 部门 uuid
  department_name?: string; // 部门名称
  icon?: string; // 部门icon
  parent_id?: string; // 父级uuid
  parent_name?: string; // 父级name
  department_code?: string;// 部门编码，关联业务数据用


}
