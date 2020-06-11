const dark = {
  "version": 8,
  "sprite": "http://10.211.55.7:10010/mapbox/sprite",
  "glyphs": "http://10.211.55.7:10010/mapbox/font/{fontstack}/{range}.pbf",
  "sources": {
    "world": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/world/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/world/{z}/{x}/{y}.pbf"
      ]
    },
    "dtbj": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/dtbj/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/dtbj/{z}/{x}/{y}.pbf"]
    },
    "xzbz": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/xzbz/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/xzbz/{z}/{x}/{y}.pbf"]
    },
    "poi": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/poi/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/poi/{z}/{x}/{y}.pbf"]
    },
    "road": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/road/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/road/{z}/{x}/{y}.pbf"]
    },
    "road2": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/road2/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/road2/{z}/{x}/{y}.pbf"]
    },
    "jzw": {
      "type": "vector",
      "scheme": "tms",
      "tiles": [
        "http://127.0.0.1:10010/vtiles/road2/{z}/{x}/{y}.pbf",
        "http://10.211.55.7:10010/vtiles/road2/{z}/{x}/{y}.pbf"]
    }
  },
  "layers": [{
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "world_country_fill",
    "type": "fill",
    "source": "world",
    "source-layer": "world_country",
    "minzoom": 0,
    "maxzoom": 11,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "#343332",
      "fill-opacity": 1,
      "fill-outline-color": "transparent"
    }
  }, {
    "id": "world_country_line",
    "type": "line",
    "source": "world",
    "source-layer": "world_country",
    "minzoom": 0,
    "maxzoom": 9,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-color": "hsl(0, 0%, 43%)",
      "line-width": ["interpolate", ["linear"],
        ["zoom"], 3, 0.5, 10, 2
      ]
    }
  }, {
    "id": "china_province_line",
    "type": "line",
    "source": "world",
    "source-layer": "china_pb",
    "minzoom": 3,
    "maxzoom": 5.5,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": ["step", ["zoom"],
        ["literal", [2, 0]], 7, ["literal", [2, 2, 6, 2]]
      ],
      "line-width": ["interpolate", ["linear"],
        ["zoom"], 7, 0.75, 12, 1.5
      ],
      "line-opacity": ["interpolate", ["linear"],
        ["zoom"], 2, 0, 3, 1
      ],
      "line-color": ["interpolate", ["linear"],
        ["zoom"], 3, "hsl(0, 0%, 27%)", 7, "hsl(0, 0%, 35%)"
      ]
    }
  }, {
    "id": "china_city_line",
    "type": "line",
    "source": "world",
    "source-layer": "china_sb",
    "minzoom": 5.5,
    "maxzoom": 9,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": {
        "base": 1,
        "stops": [
          [6, [2, 0]],
          [7, [2, 2, 6, 2]]
        ]
      },
      "line-width": {
        "base": 1,
        "stops": [
          [0, 1.2],
          [8, 0.6]
        ]
      },
      "line-color": "hsl(0, 0%, 45%)"
    }
  }, {
    "id": "world_river",
    "type": "line",
    "source": "world",
    "source-layer": "world_river",
    "minzoom": 2.6,
    "maxzoom": 8,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1,
        "stops": [
          [0, 1.5],
          [8, 2.5]
        ]
      },
      "line-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "world_lakes",
    "type": "fill",
    "source": "world",
    "source-layer": "world_lakes",
    "minzoom": 2,
    "maxzoom": 10,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-outline-color": "transparent",
      "fill-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "china_gj",
    "type": "line",
    "source": "world",
    "source-layer": "china_gj",
    "minzoom": 0,
    "maxzoom": 5,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": 1.4,
      "line-color": "rgb(163,148,94)"
    }
  }, {
    "id": "dtbj_region_qxj",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_qxj",
    "minzoom": 7,
    "maxzoom": 20,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-opacity": 1,
      "fill-color": "hsl(55, 1%, 20%)",
      "fill-outline-color": "transparent"
    }
  }, {
    "id": "dtbj_region_qxj_line",
    "type": "line",
    "source": "dtbj",
    "source-layer": "dtbj_region_qxj",
    "minzoom": 7,
    "maxzoom": 9,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": {
        "base": 1,
        "stops": [
          [6, [2, 0]],
          [7, [2, 2, 6, 2]]
        ]
      },
      "line-width": {
        "base": 1,
        "stops": [
          [0, 1.2],
          [8, 0.6]
        ]
      },
      "line-color": "hsl(0, 0%, 45%)"
    }
  }, {
    "id": "current_city_line",
    "type": "line",
    "source": "dtbj",
    "source-layer": "dtbj_region_current_city",
    "minzoom": 7,
    "maxzoom": 13,
    "layout": {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": {
        "base": 1,
        "stops": [
          [6, [2, 0]],
          [8, [2, 2, 6, 2]]
        ]
      },
      "line-width": {
        "base": 1,
        "stops": [
          [7, 2],
          [14, 2.8]
        ]
      },
      "line-color": "rgb(193,148,94)"
    }
  }, {
    "id": "dtbj_region_zb",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_zb",
    "minzoom": 8,
    "maxzoom": 18,
    "paint": {
      "fill-color": "hsl(132, 20%, 20%)",
      "fill-opacity": {
        "base": 1,
        "stops": [
          [8, 0.5],
          [18, 0.8]
        ]
      }
    }
  }, {
    "id": "dtbj_region_hl1",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_hl",
    "minzoom": 9,
    "maxzoom": 12,
    "filter": [">=", "area", 500000],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "dtbj_region_hl",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_hl",
    "minzoom": 12.01,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "dtbj_region_hpsk",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_hpsk",
    "minzoom": 9,
    "maxzoom": 12,
    "filter": [">=", "AREA", 1000000],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "dtbj_region_hpsk1",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_hpsk",
    "minzoom": 12.01,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "hsl(185, 2%, 10%)"
    }
  }, {
    "id": "dtbj_region_dy",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_dy",
    "minzoom": 5,
    "paint": {
      "fill-color": "#343332",
      "fill-outline-color": "transparent"
    }
  }, {
    "id": "dtbj_region_xqxxyl",
    "type": "fill",
    "source": "dtbj",
    "source-layer": "dtbj_region_xqxxyl",
    "minzoom": 13,
    "layout": {
      "visibility": "none"
    },
    "paint": {
      "fill-color": "rgb(24,66,106)",
      "fill-opacity": {
        "stops": [
          [12, 0.25],
          [18, 0.5]
        ]
      }
    }
  }, {
    "id": "road_region_dlm",
    "type": "fill",
    "source": "road2",
    "source-layer": "road_region_dlm",
    "minzoom": 16,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "hsl(0, 0%, 27%)",
      "fill-opacity": 1
    }
  }, {
    "id": "road-railway-1",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_tl",
    "minzoom": 8.8,
    "maxzoom": 20,
    "layout": {
      "visibility": "none"
    },
    "paint": {
      "line-color": "rgba(0, 0, 0, 1)",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 7]
        ]
      }
    }
  }, {
    "id": "road-railway-2",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_tl",
    "minzoom": 8.8,
    "maxzoom": 19,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-color": "hsl(0, 0%, 70%)",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 6]
        ]
      }
    }
  }, {
    "id": "road-railway-3",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_tl",
    "minzoom": 8.8,
    "maxzoom": 20,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": {
        "stops": [
          [7, [7, 7]],
          [10, [9, 9]]
        ]
      },
      "line-color": "#454545",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 6]
        ]
      }
    }
  }, {
    "id": "road-subway-1",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_dt",
    "minzoom": 9,
    "maxzoom": 20,
    "layout": {
      "visibility": "none"
    },
    "paint": {
      "line-color": "rgba(0, 0, 0, 1)",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 7]
        ]
      }
    }
  }, {
    "id": "road-subway-2",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_dt",
    "minzoom": 9,
    "maxzoom": 20,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-color": "hsl(0,0,60%)",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 6]
        ]
      }
    }
  }, {
    "id": "road-subway-3",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_dt",
    "minzoom": 9,
    "maxzoom": 20,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-dasharray": {
        "stops": [
          [7, [7, 7]],
          [10, [9, 9]]
        ]
      },
      "line-color": "rgb(57,83,114)",
      "line-width": {
        "base": 1.4,
        "stops": [
          [8, 1],
          [20, 6]
        ]
      }
    }
  }, {
    "id": "road_line_qcsd",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_sdxd",
    "minzoom": 8,
    "maxzoom": 19,
    "filter": ["==", "DJ", "汽车隧道"],
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.5,
        "stops": [
          [5, 0.75],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": 1
    }
  }, {
    "id": "road_line_qtdl",
    "type": "line",
    "source": "road2",
    "source-layer": "road_line_sqdl",
    "minzoom": 14.5,
    "maxzoom": 19,
    "filter": ["!in", "DJ", "次干道", "主干道"],
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.5,
        "stops": [
          [12.5, 0.5],
          [14, 2],
          [18, 10]
        ]
      },
      "line-color": "#454545",
      "line-opacity": 1
    }
  }, {
    "id": "road_line_cgd",
    "type": "line",
    "source": "road2",
    "source-layer": "road_line_sqdl",
    "minzoom": 11.5,
    "maxzoom": 16,
    "filter": ["in", "DJ", "次干道"],
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.6,
        "stops": [
          [8.5, 0.5],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1,
        "stops": [
          [11, 0.3],
          [19, 0.7]
        ]
      }
    }
  }, {
    "id": "road_line_zgd",
    "type": "line",
    "source": "road2",
    "source-layer": "road_line_sqdl",
    "minzoom": 10,
    "maxzoom": 16,
    "filter": ["in", "DJ", "主干道"],
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.6,
        "stops": [
          [8.5, 0.5],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1,
        "stops": [
          [8, 0.6],
          [20, 0.8]
        ]
      }
    }
  }, {
    "id": "road_line_xd2",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_sdxd",
    "minzoom": 10,
    "maxzoom": 16,
    "filter": ["==", "DJ", "乡道"],
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.6,
        "stops": [
          [8.5, 0.5],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1.2,
        "stops": [
          [8, 0.6],
          [20, 0.8]
        ]
      }
    }
  }, {
    "id": "road_line_xd",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_xd",
    "minzoom": 10,
    "maxzoom": 16,
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.6,
        "stops": [
          [8.5, 0.5],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1.2,
        "stops": [
          [8, 0.6],
          [20, 0.8]
        ]
      }
    }
  }, {
    "id": "road_line_sd",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_sd",
    "minzoom": 9,
    "maxzoom": 16,
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.5,
        "stops": [
          [8.5, 0.5],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1.6,
        "stops": [
          [8, 0.6],
          [20, 0.7]
        ]
      }
    }
  }, {
    "id": "road_line_gd",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_gd",
    "minzoom": 9,
    "maxzoom": 16,
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.6,
        "stops": [
          [8.5, 0.5],
          [10, 0.75],
          [18, 20]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1.2,
        "stops": [
          [8, 0.6],
          [20, 0.8]
        ]
      }
    }
  }, {
    "id": "road_line_zd",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_zd",
    "minzoom": 11,
    "maxzoom": 16,
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": {
        "base": 1.5,
        "stops": [
          [5, 0.75],
          [18, 18]
        ]
      },
      "line-color": "#454545",
      "line-opacity": {
        "base": 1,
        "stops": [
          [11, 0.4],
          [19, 0.7]
        ]
      }
    }
  }, {
    "id": "road_line_gsgl",
    "type": "line",
    "source": "road",
    "source-layer": "road_line_gsgl",
    "minzoom": 8,
    "maxzoom": 19,
    "layout": {
      "line-cap": "round",
      "line-join": "round",
      "visibility": "visible"
    },
    "paint": {
      "line-width": ["interpolate", ["exponential", 1.5],
        ["zoom"], 5, 0.75, 18, 32
      ],
      "line-color": "#454545",
      "line-opacity": 1
    }
  }, {
    "id": "road-sqdl-label1",
    "type": "symbol",
    "source": "road2",
    "source-layer": "road_line_sqdl",
    "minzoom": 11,
    "maxzoom": 13,
    "filter": ["in", "DJ", "主干道", "次干道"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 360,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-sqdl-label2",
    "type": "symbol",
    "source": "road2",
    "source-layer": "road_line_sqdl",
    "minzoom": 13,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 360,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-padding": 1,
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-zd-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_zd",
    "minzoom": 13,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-xd-label2",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_sdxd",
    "minzoom": 13,
    "filter": ["==", "DJ", "乡道"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-padding": 1,
      "text-rotation-alignment": "map",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-xd-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_xd",
    "minzoom": 13,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-padding": 1,
      "text-rotation-alignment": "map",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-sd-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_sd",
    "minzoom": 12,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 10],
          [20, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "symbol-avoid-edges": true
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-railway-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_tl",
    "minzoom": 10,
    "layout": {
      "text-size": {
        "base": 1.3,
        "stops": [
          [9, 13],
          [16, 15]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-subway-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_dt",
    "minzoom": 10,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [9, 13],
          [18, 16]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 330,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "text-rotation-alignment": "map"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-gd-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_gd",
    "minzoom": 10,
    "layout": {
      "text-size": {
        "base": 1.2,
        "stops": [
          [9, 10],
          [16, 18],
          [18, 20]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 360,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-qcsd-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_sdxd",
    "minzoom": 8,
    "filter": ["==", "DJ", "汽车隧道"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [7, 12],
          [16, 18],
          [18, 20]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 360,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "road-gs-label",
    "type": "symbol",
    "source": "road",
    "source-layer": "road_line_gsgl",
    "minzoom": 8,
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [7, 12],
          [16, 18],
          [18, 20]
        ]
      },
      "text-max-angle": 30,
      "symbol-spacing": 350,
      "text-font": ["微软雅黑"],
      "symbol-placement": "line",
      "text-field": "{MC}",
      "text-letter-spacing": 0.01
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "jzw_region_lk",
    "type": "fill-extrusion",
    "source": "jzw",
    "source-layer": "jzw_region_lk",
    "minzoom": 15,
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-extrusion-color": "rgb(13,13,13)",
      "fill-extrusion-height": ["interpolate", ["linear"],
        ["zoom"], 15, 0, 15.05, ["*", ["get", "FWCS"], 4]
      ],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.8,
      "fill-extrusion-translate-anchor": "map",
      "fill-extrusion-vertical-gradient": false
    }
  }, {
    "id": "world_country_label1",
    "type": "symbol",
    "source": "world",
    "source-layer": "world_label",
    "minzoom": 2,
    "maxzoom": 10,
    "filter": ["==", "TYPE", "国家"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [2, 16],
          [12, 26]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-anchor": "center",
      "text-field": "{NAME}",
      "text-padding": 25,
      "text-max-width": 8
    },
    "paint": {
      "icon-opacity": ["step", ["zoom"],
        ["case", ["has", "text_anchor"], 1, 0], 7, 0
      ],
      "text-color": "hsl(0, 0%, 45%)",
      "text-halo-color": ["interpolate", ["linear"],
        ["zoom"], 2, "hsla(0, 0%, 10%, 0.75)", 3, "hsl(0, 0%, 10%)"
      ],
      "text-halo-width": 1.25,
      "text-halo-blur": 1
    }
  }, {
    "id": "china_label",
    "type": "symbol",
    "source": "world",
    "source-layer": "world_label",
    "minzoom": 2,
    "maxzoom": 3,
    "filter": ["==", "TYPE", "中国"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [2, 18],
          [8, 26]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-anchor": "center",
      "text-field": "{NAME}",
      "text-padding": 25,
      "text-max-width": 8
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "china_province_label",
    "type": "symbol",
    "source": "world",
    "source-layer": "world_label",
    "minzoom": 3,
    "maxzoom": 4,
    "filter": ["==", "TYPE", "省"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [3, 14],
          [8, 20]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-anchor": "center",
      "text-field": "{NAME}",
      "text-padding": 10,
      "text-max-width": 8
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1,
      "text-translate": [0, 0]
    }
  }, {
    "id": "china_province_capital_label",
    "type": "symbol",
    "source": "world",
    "source-layer": "world_label",
    "minzoom": 4,
    "maxzoom": 5.5,
    "filter": ["==", "TYPE", "省会"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [3, 14],
          [8, 20]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-anchor": "center",
      "text-field": "{NAME}",
      "text-padding": 10,
      "text-max-width": 8
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1,
      "text-translate": [0, 0]
    }
  }, {
    "id": "china_city_label",
    "type": "symbol",
    "source": "world",
    "source-layer": "world_label",
    "minzoom": 5.5,
    "maxzoom": 9,
    "filter": ["==", "TYPE", "市"],
    "layout": {
      "text-size": {
        "base": 1,
        "stops": [
          [5, 14],
          [8, 18]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-anchor": "center",
      "text-field": "{NAME}",
      "text-padding": 10,
      "text-max-width": 8
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1,
      "text-translate": [0, 0]
    }
  }, {
    "id": "xzbz_point_sqxzf",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_sqxzf",
    "minzoom": 7,
    "maxzoom": 10,
    "filter": ["!=", "CFL", "市政府"],
    "layout": {
      "text-size": {
        "base": 1.25,
        "stops": [
          [5, 14],
          [12, 26]
        ]
      },
      "icon-offset": [-12, -3],
      "icon-image": {
        "base": 1,
        "stops": [
          [0, "point-small"],
          [12, ""]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "icon-size": {
        "base": 1,
        "stops": [
          [4, 0.5],
          [12, 1]
        ]
      },
      "text-anchor": {
        "base": 1,
        "stops": [
          [0, "left"],
          [5, "center"]
        ]
      },
      "text-field": "{DMJC}",
      "text-max-width": 8
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "dtbj_region_dy_label",
    "type": "symbol",
    "source": "dtbj",
    "source-layer": "dtbj_region_dy",
    "minzoom": 10,
    "layout": {
      "text-padding": {
        "stops": [
          [8, 10],
          [12, 40],
          [14, 100]
        ]
      },
      "text-anchor": "center",
      "text-size": {
        "base": 1,
        "stops": [
          [7, 12],
          [15, 20]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-offset": [0, 0],
      "text-field": "{MC}"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "poi_shan",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_shan",
    "minzoom": 9.8,
    "maxzoom": 19,
    "layout": {
      "text-field": "{DMJC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 1.2,
        "stops": [
          [11, 14],
          [18, 20]
        ]
      },
      "text-max-angle": 38,
      "text-padding": 30,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "dtbj_region_hl_label",
    "type": "symbol",
    "source": "dtbj",
    "source-layer": "dtbj_region_hl",
    "minzoom": 9,
    "maxzoom": 12,
    "filter": [">=", "area", 500000],
    "layout": {
      "text-field": "{MC}",
      "text-font": ["微软雅黑"],
      "text-pitch-alignment": "auto",
      "text-max-angle": 30,
      "text-padding": 40,
      "text-size": {
        "base": 1,
        "stops": [
          [12, 12],
          [16, 18]
        ]
      }
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "dtbj_region_hl_label1",
    "type": "symbol",
    "source": "dtbj",
    "source-layer": "dtbj_region_hl",
    "minzoom": 12.01,
    "layout": {
      "text-field": "{MC}",
      "text-font": ["微软雅黑"],
      "text-pitch-alignment": "auto",
      "text-max-angle": 30,
      "text-padding": 40,
      "text-size": {
        "base": 1,
        "stops": [
          [12, 12],
          [16, 18]
        ]
      }
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "dtbj_region_hpsk_label",
    "type": "symbol",
    "source": "dtbj",
    "source-layer": "dtbj_region_hpsk",
    "minzoom": 9,
    "maxzoom": 12,
    "filter": [">=", "AREA", 1000000],
    "layout": {
      "text-field": "{MC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 1,
        "stops": [
          [12, 14],
          [16, 18]
        ]
      },
      "text-rotation-alignment": "viewport",
      "text-padding": 80
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "dtbj_region_hpsk_label1",
    "type": "symbol",
    "source": "dtbj",
    "source-layer": "dtbj_region_hpsk",
    "minzoom": 12.01,
    "layout": {
      "text-field": "{MC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 1,
        "stops": [
          [12, 14],
          [16, 18]
        ]
      },
      "text-rotation-alignment": "viewport",
      "text-padding": 80
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "xzbz_point_town",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_jdxz",
    "minzoom": 9.5,
    "maxzoom": 14,
    "layout": {
      "symbol-sort-key": 1,
      "text-padding": 25,
      "text-anchor": "center",
      "text-size": {
        "base": 1,
        "stops": [
          [7, 12],
          [15, 20]
        ]
      },
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-offset": [0, 0],
      "text-field": "{MC}"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "xzbz_point_village",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_zzfcw",
    "minzoom": 12.5,
    "maxzoom": 17,
    "filter": ["!=", "CFL", "乡镇政府"],
    "layout": {
      "text-field": "{DMJC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 1.1,
        "stops": [
          [10, 11],
          [18, 16]
        ]
      },
      "text-max-angle": 38,
      "text-padding": 30,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "poi_bgjd",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_bgjd",
    "minzoom": 15,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 2,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 20,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "poi_cyfw",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_cyfw",
    "minzoom": 15,
    "filter": ["in", "CFL", "必胜客", "海鲜", "韩式餐厅", "火锅", "肯德基", "麦当劳", "美食城", "日式餐厅", "西餐厅", "中餐厅", "自助餐"],
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 3,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 25,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_gsqy",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_gsqy",
    "minzoom": 15,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 2,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 20,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_syds",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_syds",
    "minzoom": 15,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 2,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 20,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_kyjy",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_kyjy",
    "minzoom": 15,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 2,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 20,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_ylfw",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_ylfw",
    "minzoom": 15,
    "filter": ["in", "CFL", "妇幼保健", "急救中心", "康复中心", "疗养院", "专科医院", "综合一级医院", "综合二级医院", "综合三级医院", "综合医院"],
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 1.5,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 20,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_jrfw",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_jrfw",
    "minzoom": 15,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 2,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 25,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_zzxq",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_zzxq",
    "minzoom": 14,
    "layout": {
      "text-line-height": 1,
      "text-size": {
        "base": 1.4,
        "stops": [
          [14, 14],
          [18, 18]
        ]
      },
      "text-max-angle": 38,
      "text-font": ["微软雅黑"],
      "text-offset": [0, 0],
      "text-field": "{DMJC}",
      "text-padding": 25,
      "text-max-width": 8,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "poi_gkmt",
    "type": "symbol",
    "source": "poi",
    "source-layer": "poi_gkmt",
    "minzoom": 11,
    "maxzoom": 19,
    "layout": {
      "symbol-sort-key": 1,
      "text-field": "{DMJC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 5,
        "stops": [
          [11, 14],
          [18, 20]
        ]
      },
      "text-max-angle": 38,
      "text-padding": 10,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  }, {
    "id": "xzbz_point_zfjg",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_zfjg",
    "minzoom": 11,
    "maxzoom": 19,
    "layout": {
      "symbol-sort-key": 0,
      "text-field": "{DMJC}",
      "text-font": ["微软雅黑"],
      "text-max-width": 8,
      "text-size": {
        "base": 1.1,
        "stops": [
          [11, 14],
          [18, 20]
        ]
      },
      "text-max-angle": 38,
      "text-padding": 10,
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "xzbz_point_hczdtz",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_hczdtz",
    "minzoom": 10,
    "filter": ["all", ["==", "CFL", "火车站"],
      ["in", "BZDM", "青岛火车站", "青岛火车北站", "青岛西站", "红岛火车站", "即墨北站", "平度火车站", "平度北火车站", "董家口火车站", "胶州北站", "胶州火车站", "莱西火车站", "即墨火车站"]
    ],
    "layout": {
      "text-field": "{BZDM}",
      "text-max-width": 8,
      "text-letter-spacing": 0.15,
      "text-line-height": 1.5,
      "text-font": ["微软雅黑"],
      "text-size": {
        "base": 4,
        "stops": [
          [7, 14],
          [18, 20]
        ]
      }
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "xzbz_point_jc",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_jc",
    "minzoom": 10,
    "layout": {
      "text-field": "{DMJC}",
      "text-max-width": 8,
      "text-letter-spacing": 0.15,
      "text-line-height": 1.5,
      "text-font": ["微软雅黑"],
      "text-size": {
        "base": 4,
        "stops": [
          [7, 14],
          [18, 20]
        ]
      }
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }, {
    "id": "xzbz_point_jtzj",
    "type": "symbol",
    "source": "xzbz",
    "source-layer": "xzbz_point_jtzj",
    "minzoom": 9,
    "maxzoom": 14,
    "layout": {
      "text-field": "{DMJC}",
      "text-max-width": 8,
      "text-font": ["微软雅黑"],
      "text-size": {
        "base": 1,
        "stops": [
          [7, 16],
          [15, 20]
        ]
      }
    },
    "paint": {
      "text-color": "hsl(0, 0%, 70%)",
      "text-halo-color": "hsla(0, 0%, 10%, 0.75)",
      "text-halo-blur": 1,
      "text-halo-width": 1
    }
  }]
};

export { dark };
