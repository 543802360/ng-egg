export interface IBuilding {
  building_id?: string; // 楼宇 ID
  building_name?: string; // 楼宇名称
  building_height?: number; // 楼宇高度
  building_floor?: number; // 楼宇层数
  building_bz?: string; // 楼宇备注
  building_address?: string; // 楼宇地址
  yxbz?: string; // 有效标志
  jdxz_dm?: string; // 街道乡镇代码
  xzqh_dm?: string; // 行政区划代码
  shape?: string; // 图形geometry

}
