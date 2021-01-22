/**
 * 对象数组排序
 * @param property :属性名称
 */
export function order(property) {
  return (obj1, obj2) => {
    const val1 = obj1[property];
    const val2 = obj2[property];

    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0
    }

  }
};
