/*
 * @Author: 刘硕
 * @Date: 2020-03-10 09:05:00
 * @LastEditTime: 2020-03-11 14:01:16
 * @LastEditors: Please set LastEditors
 * @Description: 共享模块通用工具、接口、模型导出
 * @FilePath: /ng-egg/src/app/shared/index.ts
 */
// 组件类

// 工具类
export * from './utils/yuan';
export * from './utils/array2tree';

// 接口类

export * from './models/IMenu';
export * from './models/IDepartment';
export * from './models/IRole';
export * from "./models/IUser";
export * from "./models/MenuType";
export * from './models/TableOperator';
// 模块
export * from './shared.module';
