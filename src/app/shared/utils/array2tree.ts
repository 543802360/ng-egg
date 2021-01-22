/*
 * @Author: your name
 * @Date: 2020-03-10 23:11:42
 * @LastEditTime: 2020-03-11 10:03:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/app/shared/utils/array2tree.ts
 */
export function array2tree(data, id, parentId, children) {
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children;
  });
  const map = {};
  data.forEach(item => {
    map[item[id]] = item;
  });
  data.forEach(item => {
    const parent = map[item[parentId]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;

}
