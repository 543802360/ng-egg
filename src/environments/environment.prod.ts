export const environment = {
  SERVER_URL: `http://35.1.149.22:10920/api/`,
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
    center: [120.33115, 36.251774],
    zoom: 10.1839,
    pitch: 55

  },
  mapStyle: {
    resourceUrl: 'http://35.1.196.63:10010',
    mbtiles: {
      world: [
        'http://35.1.196.63:10010/vtiles/world/{z}/{x}/{y}.pbf',
        'http://35.1.196.64:10010/vtiles/world/{z}/{x}/{y}.pbf'
      ],
      province:
        [
          'http://35.1.196.63:10010/vtiles/province/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/province/{z}/{x}/{y}.pbf'
        ],
      dtbj:
        [
          'http://35.1.196.63:10010/vtiles/dtbj/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/dtbj/{z}/{x}/{y}.pbf'

        ],
      xzbz:
        [
          'http://35.1.196.63:10010/vtiles/xzbz/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/xzbz/{z}/{x}/{y}.pbf'

        ],
      jzw:
        [
          'http://35.1.196.63:10010/vtiles/jzw/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/jzw/{z}/{x}/{y}.pbf'

        ],
      road:
        [
          'http://35.1.196.63:10010/vtiles/road/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/road/{z}/{x}/{y}.pbf'

        ],
      road2:
        [
          'http://35.1.196.63:10010/vtiles/road2/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/road2/{z}/{x}/{y}.pbf'

        ],
      poi:
        [
          'http://35.1.196.63:10010/vtiles/poi/{z}/{x}/{y}.pbf',
          'http://35.1.196.64:10010/vtiles/poi/{z}/{x}/{y}.pbf'
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
