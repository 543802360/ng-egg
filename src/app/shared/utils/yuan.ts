/*
 * @Author: your name
 * @Date: 2020-03-10 09:05:00
 * @LastEditTime: 2020-03-10 23:11:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/shared/utils/yuan.ts
 */
/**
 * 转化成RMB元字符串
 * @param digits 当数字类型时，允许指定小数点后数字的个数，默认2位小数
 */
// tslint:disable-next-line:no-any
export function yuan(value: any, digits: number = 2): string {
  if (typeof value === 'number') {
    value = value.toFixed(digits);
  }
  // return `&yen ${value}`;
  return ` ${value}`;

}


