export const environment = {
  // SERVER_URL: `http://15.72.178.175:10920/api/`,
  // SERVER_URL: `http://120.221.72.3:10010/api/`,
  SERVER_URL: `http://192.168.207.136:10920/api/`,

  production: true,
  useHash: true,
  hmr: false,
  map: {
    // 矢量地图
    VECTOR_MAP:
      "http://35.1.149.176:8080/QDKCY/arcgis/rest/services/gz/MapServer",
    VECTOR_MAP_TILE:
      "http://35.1.149.176:8080/arcgis/rest/services/qdslmap/MapServer/tile/{z}/{y}/{x}",
    // 影像地图
    IMAGE_MAP:
      "http://35.1.149.160:6080/arcgis/rest/services/qdyx2017/MapServer"
  },
  mapbox_pos: {
    // 119.91870051878709, lat: 35.80802952765178
    center: [119.9187, 35.80802952765178],
    zoom: 8.973,
    pitch: 55

  },
  mapStyle: {
    resourceUrl: 'http://15.72.178.178:10010',
    mbtiles: {
      world: [
        'http://15.72.178.178:10010/vtiles/world/{z}/{x}/{y}.pbf'
      ],
      province:
        [
          'http://15.72.178.178:10010/vtiles/province/{z}/{x}/{y}.pbf'
        ],
      dtbj:
        [
          'http://15.72.178.178:10010/vtiles/dtbj/{z}/{x}/{y}.pbf'
        ],
      xzbz:
        [
          'http://15.72.178.178:10010/vtiles/xzbz/{z}/{x}/{y}.pbf'
        ],
      jzw:
        [
          'http://15.72.178.178:10010/vtiles/jzw/{z}/{x}/{y}.pbf'
        ],
      road:
        [
          'http://15.72.178.178:10010/vtiles/road/{z}/{x}/{y}.pbf'
        ],
      road2:
        [
          'http://15.72.178.178:10010/vtiles/road2/{z}/{x}/{y}.pbf'
        ],
      poi:
        [
          'http://15.72.178.178:10010/vtiles/poi/{z}/{x}/{y}.pbf'
        ]
    }

  },
  reportsUrl: {
    czsr: 'http://35.1.149.22:8080/bb/bb/czsr',
    hy: 'http://35.1.149.22:8080/bb/bb/hy',
    hyall: 'http://35.1.149.22:8080/bb/bb/hyall',
    zj: 'http://35.1.149.22:8080/bb/bb/zj',
    nsr: 'http://35.1.149.22:8080/bb/bb/nsr',
  }
};
