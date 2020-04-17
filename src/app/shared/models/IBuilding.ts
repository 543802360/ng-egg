export interface IBuilding {
  building_id?: string;
  building_name?: string;
  building_height?: number;
  building_floor?: number;
  building_bz?: string;
  building_address?: string; // 楼宇地址
  yxbz?: string; // 有效标志
  jdxz_dm?: string; // 街道乡镇代码
  xzqh_dm?: string; // 行政区划代码
  shape?: string; // 图形geometry

}
