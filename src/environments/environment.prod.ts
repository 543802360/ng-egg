export const environment = {
  SERVER_URL: `http://127.0.0.1:10920/api/`,
  production: true,
  useHash: true,
  hmr: false,
  map: {
    // 矢量地图
    VECTOR_MAP:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdslmap/MapServer",
    VECTOR_MAP_TILE:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdslmap/MapServer/tile/{z}/{y}/{x}",
    // 影像地图
    IMAGE_MAP:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdyxmap/MapServer",
    IMAGE_MAP_TILE:
      "https://www.qddsgis.com:2600/arcgis/rest/services/qdyxmap/MapServer/tile/{z}/{y}/{x}",
  },
};
