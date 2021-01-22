export const environment = {
  SERVER_URL: `http://140.68.16.96:10920/api/`,
  production: true,
  useHash: true,
  hmr: false,
  map: {
    // 矢量地图
    VECTOR_MAP:
      "http://140.68.16.96:10050/arcgis/rest/services/slmap/MapServer",
    VECTOR_MAP_TILE:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdslmap/MapServer/tile/{z}/{y}/{x}",
    // 影像地图
    IMAGE_MAP:
      "http://140.68.16.96:10050/arcgis/rest/services/yxmap/MapServer",
    IMAGE_MAP_TILE:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdyxmap/MapServer/tile/{z}/{y}/{x}",
  },
  mapStyle: {
    resourceUrl: 'http://140.68.16.98:10010',
    mbtiles: {
      world: [
        'http://140.68.16.98:10010/vtiles/world/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/world/{z}/{x}/{y}.pbf'
      ],
      province: [
        'http://140.68.16.98:10010/vtiles/province/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/province/{z}/{x}/{y}.pbf'
      ],
      dtbj: [
        'http://140.68.16.98:10010/vtiles/dtbj/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/dtbj/{z}/{x}/{y}.pbf'
      ],
      xzbz: [
        'http://140.68.16.98:10010/vtiles/xzbz/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/xzbz/{z}/{x}/{y}.pbf'
      ],
      jzw: [
        'http://140.68.16.98:10010/vtiles/jzw/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/jzw/{z}/{x}/{y}.pbf'
      ],
      road: [
        'http://140.68.16.98:10010/vtiles/road/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/road/{z}/{x}/{y}.pbf'
      ],
      road2: [
        'http://140.68.16.98:10010/vtiles/road2/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/road2/{z}/{x}/{y}.pbf'
      ],
      poi: [
        'http://140.68.16.98:10010/vtiles/poi/{z}/{x}/{y}.pbf',
        'http://140.68.16.97:10010/vtiles/poi/{z}/{x}/{y}.pbf'
      ]
    }

  },
};
