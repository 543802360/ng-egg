/*
 * @Author: your name
 * @Date: 2020-03-11 13:55:11
 * @LastEditTime: 2020-03-11 13:58:58
 * @LastEditors: Please set LastEditors
 * @Description: 用户接口
 * @FilePath: /ng-egg/src/app/shared/models/IUser.ts
 */
export interface IUser {
  userid?: string;
  username?: string;
  roleid?: string;
  rolename?: string;
  department_id?: string;
  department_name?: string;
  creator_id?: string;// 用户创建者id
  password?: string;
  name?: string;
  email?: string;
  photo?: string;
  is_login?: boolean;
}
