/*
 * @Author: your name
 * @Date: 2020-03-09 23:00:46
 * @LastEditTime: 2020-03-10 13:59:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ng-egg/src/environments/environment.ts
 */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // SERVER_URL: `http://192.168.3.50:10920/api/`,
  SERVER_URL: `http://127.0.0.1:10920/api/`,
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
  mapStyle: {
    resourceUrl: 'http://47.105.192.51:10010',
    mbtiles: {
      world: ['http://47.105.192.51:10010/vtiles/world/{z}/{x}/{y}.pbf'],
      province: ['http://47.105.192.51:10010/vtiles/province/{z}/{x}/{y}.pbf'],
      dtbj: ['http://47.105.192.51:10010/vtiles/dtbj/{z}/{x}/{y}.pbf'],
      xzbz: ['http://47.105.192.51:10010/vtiles/xzbz/{z}/{x}/{y}.pbf'],
      jzw: ['http://47.105.192.51:10010/vtiles/jzw/{z}/{x}/{y}.pbf'],
      road: ['http://47.105.192.51:10010/vtiles/road/{z}/{x}/{y}.pbf'],
      road2: ['http://47.105.192.51:10010/vtiles/road2/{z}/{x}/{y}.pbf'],
      poi: ['http://47.105.192.51:10010/vtiles/poi/{z}/{x}/{y}.pbf']
    }

  },
  reportsUrl: {
    czsr: 'http://35.1.149.22:8080/bb/bb/czsr',
    hy: 'http://35.1.149.22:8080/bb/bb/hy',
    hyall: 'http://35.1.149.22:8080/bb/bb/hyall',
    zj: 'http://35.1.149.22:8080/bb/bb/zj',
    nsr: 'http://35.1.149.22:8080/bb/bb/nsr',
  },
  production: false,
  useHash: true,
  hmr: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
