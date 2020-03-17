/*
 * @Author: your name
 * @Date: 2020-03-11 13:56:04
 * @LastEditTime: 2020-03-11 14:00:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/shared/models/IDepartment.ts
 */
export interface IDepartment {
  department_id: string; // 部门 uuid
  department_name: string;
  icon: string;
  parent_id: string;
  parent_name: string;
  department_code: string;// 部门编码，关联业务数据用


}
