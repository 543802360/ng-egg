import { environment } from '../../../environments/environment';
const decimal_T = {
    version: 8,
    sources: {
        world: {
            type: 'vector',
            scheme: 'tms',
            tiles: environment.mapStyle.mbtiles.world
        },
        province: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.province
        },
        dtbj: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.dtbj
        },
        xzbz: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.xzbz

        },
        poi: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.poi

        },
        road: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.road,

        },
        jzw: {
            type: "vector",
            scheme: "tms",
            tiles: environment.mapStyle.mbtiles.jzw
        }

    },
    glyphs: `${environment.mapStyle.resourceUrl}/mapbox/font/{fontstack}/{range}.pbf`,
    // glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sprite: `${environment.mapStyle.resourceUrl}/mapbox/sprite`,
    layers: [
        // 背景
        {
            // 背景图层
            id: "background",
            type: "background",
            paint: {
                // "background-color": "hsl(55, 1%, 20%)"
                // 'background-color': 'rgb(18,58,106)'
                'background-color':
                {
                    stops: [
                        [0, '#142a21'],
                        [17, '#142a21'],
                        [17.01, 'hsl(0, 0%, 0%)']
                    ]
                }
            }
        },

        // 世界国家填充面
        {
            id: "world_country_fill",
            source: "world",
            "source-layer": "world_country",
            type: "fill",
            minzoom: 0,
            maxzoom: 11,
            layout: {
                "visibility": "visible"
            },
            paint: {
                "fill-color": 'hsl(0, 0%, 0%)',
                // "fill-color": "#000001",
                // "fill-color": "hsl(55, 1%, 20%)",
                "fill-opacity": 1,
                "fill-outline-color": "transparent"
            }
        },
        // 国家边界线
        {
            id: "world_country_line",
            source: "world",
            "source-layer": "world_country",
            type: "line",
            minzoom: 0,
            maxzoom: 9,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-dasharray": {
                    "base": 1,
                    "stops": [
                        [
                            6,
                            [
                                2,
                                0
                            ]
                        ],
                        [
                            7,
                            [
                                2,
                                2,
                                6,
                                2
                            ]
                        ]
                    ]
                },
                "line-width": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            0.8
                        ],
                        [
                            8,
                            0.5
                        ]
                    ]
                },
                "line-color": "#142a21"

            }
        },


        // 中国省 边界线
        {
            id: "china_province_line",
            source: "world",
            "source-layer": "china_pb",
            type: "line",
            minzoom: 3,
            maxzoom: 5.5,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-dasharray": {
                    "base": 1,
                    "stops": [
                        [
                            6,
                            [
                                2,
                                0
                            ]
                        ],
                        [
                            7,
                            [
                                2,
                                2,
                                6,
                                2
                            ]
                        ]
                    ]
                },
                "line-width": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            1.2
                        ],
                        [
                            8,
                            0.6
                        ]
                    ]
                },
                "line-color": '#3c7e61'

            }
        },
        // 中国市边界线
        {
            id: "china_city_line",
            source: "world",
            "source-layer": "china_sb",
            type: "line",
            minzoom: 5.5,
            maxzoom: 9,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-dasharray": {
                    "base": 1,
                    "stops": [
                        [
                            6,
                            [
                                2,
                                0
                            ]
                        ],
                        [
                            7,
                            [
                                2,
                                2,
                                6,
                                2
                            ]
                        ]
                    ]
                },
                "line-width": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            1.2
                        ],
                        [
                            8,
                            0.6
                        ]
                    ]
                },
                "line-color": '#3c7e61'

            }
        },  // 世界河流
        {
            id: "world_river",
            type: "line",
            source: "world",
            "source-layer": "world_river",
            minzoom: 2.6,
            maxzoom: 8,
            layout: {
                "visibility": 'visible'
            },
            "paint": {
                "line-width": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            1.5
                        ],
                        [
                            8,
                            2.5
                        ]
                    ]
                },
                "line-color": '#113549'
            }
        },
        // 世界湖泊
        {
            id: "world_lakes",
            type: "fill",
            source: "world",
            "source-layer": "world_lakes",
            minzoom: 2,
            maxzoom: 10,
            layout: {
                "visibility": 'visible'
            },
            "paint": {
                "fill-outline-color": "transparent",
                "fill-color": '#113549'
            }
        },
        // 中国国界
        {
            id: "china_gj",
            source: "world",
            "source-layer": "china_gj",
            type: "line",
            minzoom: 0,
            maxzoom: 5,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "visible"
            },
            "paint": {

                "line-width": 1.4,
                "line-color": 'rgb(163,148,94)'
            }
        },

        // //区县填充
        {
            id: "dtbj_region_qxj",
            source: "province",
            "source-layer": "dtbj_region_qxj",
            type: "fill",
            minzoom: 7,
            maxzoom: 19.01,
            layout: {
                "visibility": "visible"
            },
            paint: {
                "fill-color": 'hsl(0, 0%, 0%)',
                // "fill-color": "#000001",
                // "fill-color": "hsl(55, 1%, 20%)",
                "fill-opacity": 1,
                "fill-outline-color": "transparent"
            }
        },

        // 县界
        {
            id: "dtbj_region_qxj_line",
            source: "province",
            "source-layer": "dtbj_region_qxj",
            type: "line",
            minzoom: 7,
            maxzoom: 9,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": "none"
            },
            "paint": {
                "line-dasharray": {
                    "base": 1,
                    "stops": [
                        [
                            6,
                            [
                                2,
                                0
                            ]
                        ],
                        [
                            7,
                            [
                                2,
                                2,
                                6,
                                2
                            ]
                        ]
                    ]
                },
                "line-width": {
                    "base": 1,
                    "stops": [
                        [
                            7,
                            0.75
                        ],
                        [
                            12,
                            1.5
                        ]
                    ]
                },
                "line-color": "#3c7e61"

            }
        },
        // // 当前市界
        // {
        //     id: "current_city_line",
        //     source: "dtbj",
        //     "source-layer": "dtbj_region_current_city",
        //     type: "line",
        //     minzoom: 7,
        //     maxzoom: 13,
        //     "layout": {
        //         "line-join": "round",
        //         "line-cap": "round",
        //         "visibility": "visible"
        //     },
        //     "paint": {
        //         "line-dasharray": {
        //             "base": 1,
        //             "stops": [
        //                 [
        //                     6,
        //                     [
        //                         2,
        //                         0
        //                     ]
        //                 ],
        //                 [
        //                     8,
        //                     [
        //                         2,
        //                         2,
        //                         6,
        //                         2
        //                     ]
        //                 ]
        //             ]
        //         },
        //         "line-width": {
        //             "base": 1,
        //             "stops": [
        //                 [
        //                     7,
        //                     2
        //                 ],
        //                 [
        //                     14,
        //                     2.8
        //                 ]
        //             ]
        //         },
        //         "line-color": 'rgb(193,148,94)'
        //     }
        // },

        // 植被（森林）
        {
            id: "dtbj_region_sl",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_sl",
            minzoom: 8,
            maxzoom: 18,
            "layout": {},
            "paint": {
                "fill-color": "hsl(132, 20%, 20%)",
                "fill-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            13,
                            0.7
                        ]
                    ]
                }
            }
        },
        // 植被（公园绿地）
        {
            id: "dtbj_region_gyld",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_gyld",
            minzoom: 9,
            maxzoom: 18,
            "layout": {},
            "paint": {
                "fill-color": "hsl(132, 20%, 20%)",
                "fill-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            13,
                            0.7
                        ]
                    ]
                }
            }
        },
        // 河流
        {
            id: "dtbj_region_hl",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_hl",
            minzoom: 9,
            maxzoom: 12,
            filter: [
                ">=",
                "area",
                500000
            ],
            layout: {},
            "paint": {
                "fill-color": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            "#285441"
                        ],
                        [
                            12,
                            "#142a21"
                        ]
                    ]
                },
                "fill-outline-color": "transparent"
            }
        },
        // 河流1
        {
            id: "dtbj_region_hl1",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_hl",
            minzoom: 11.01,
            layout: {},
            "paint": {
                "fill-color": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            // 'rgb(18,47,70)'
                            "#285441"
                        ],
                        [
                            12,
                            // 'rgb(18,47,70)'
                            "#142a21"
                        ]
                    ]
                },
                "fill-outline-color": "transparent"
            }
        },
        // 湖泊面
        {
            id: "dtbj_region_hpsk",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_hpsk",
            minzoom: 9,
            maxzoom: 19.01,
            layout: {},
            "paint": {
                "fill-color": '#142a21',
                "fill-outline-color": "transparent"
            }
        },

        // 岛屿
        {
            id: "dtbj_region_dy",
            type: "fill",
            source: "dtbj",
            "source-layer": "dtbj_region_dy",
            minzoom: 5,
            layout: {},
            "paint": {
                "fill-color": 'hsl(0, 0%, 0%)',
                "fill-outline-color": "transparent"
            }
        },

        // 小区医院学校轮廓
        {
            "id": "dtbj_region_xqxxyl",
            "type": "fill",
            "source": "dtbj",
            "source-layer": "dtbj_region_xqlk",
            minzoom: 13,
            "layout": {},
            "paint": {

                "fill-color": "#142a21",
                "fill-antialias": true,
                "fill-opacity": 0.75
            }
        },

        // /////////道路线
        // 铁路
        {
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
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            7
                        ]
                    ]
                }
            },

        },
        {
            "id": "road-railway-2",
            "type": "line",
            "source": "road",
            "source-layer": "road_line_tl",
            "minzoom": 8.8,
            "maxzoom": 20,

            "layout": {
                "visibility": "visible"
            },
            "paint": {

                "line-color": '#3c7e61',
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            6
                        ]
                    ]
                }
            },

        },
        {
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
                        [
                            7,
                            [
                                7,
                                7
                            ]
                        ],
                        [
                            10,
                            [
                                9,
                                9
                            ]
                        ]
                    ]
                },
                "line-color": {
                    "stops": [
                        [
                            6,
                            "#285441"
                        ],
                        [
                            10,
                            "#285441"
                        ]
                    ]
                },
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            6
                        ]
                    ]
                }
            },

        },
        // 地铁
        {
            "id": "road-subway-1",
            "type": "line",
            "source": "road",
            "source-layer": "road_line_dt",
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
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            7
                        ]
                    ]
                }
            },

        },
        {
            "id": "road-subway-2",
            "type": "line",
            "source": "road",
            "source-layer": "road_line_dt",
            "minzoom": 8.8,
            "maxzoom": 20,

            "layout": {
                "visibility": "visible"
            },
            "paint": {
                // "line-color": "rgba(38, 61, 86, 1)",
                // "line-color": '#285441',//高速
                "line-color": '#3c7e61',
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            6
                        ]
                    ]
                }
            },

        },
        {
            "id": "road-subway-3",
            "type": "line",
            "source": "road",
            "source-layer": "road_line_dt",
            "minzoom": 8.8,
            "maxzoom": 19.01,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-dasharray": {
                    "stops": [
                        [
                            7,
                            [
                                7,
                                7
                            ]
                        ],
                        [
                            10,
                            [
                                9,
                                9
                            ]
                        ]
                    ]
                },
                "line-color": {
                    "stops": [
                        [
                            6,
                            "#285441"
                        ],
                        [
                            10,
                            "#285441"
                        ]
                    ]
                },
                "line-width": {
                    "base": 1.4,
                    "stops": [
                        [
                            8,
                            1
                        ],
                        [
                            20,
                            6
                        ]
                    ]
                }
            },

        },
        // 其他道路
        {
            id: "road_line_qtdl",
            type: "line",
            source: "road",
            "source-layer": "road_line_qtdl",
            minzoom: 14.5,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.5,
                    "stops": [
                        [
                            12.5,
                            0.5
                        ],
                        [
                            14,
                            2
                        ],
                        [
                            18,
                            10
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": 1
            },
        },
        // 市区杂路
        {
            id: "road_line_cgd",
            type: "line",
            source: "road",
            "source-layer": "road_line_sqzl",
            minzoom: 11.5,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.6,
                    "stops": [
                        [
                            8.5,
                            0.5
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            11,
                            0.3
                        ],
                        [
                            19,
                            0.7
                        ]
                    ]
                }
            }
        },
        // 主干道(市区道路)
        {
            id: "road_line_sqdl",
            type: "line",
            source: "road",
            "source-layer": "road_line_sqdl",
            minzoom: 10,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.6,
                    "stops": [
                        [
                            8.5,
                            0.5
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            20,
                            0.8
                        ]
                    ]
                }
            }
        },
        // 县道
        {
            id: "road_line_xd",
            type: "line",
            source: "road",
            "source-layer": "road_line_xd",
            minzoom: 10,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.6,
                    "stops": [
                        [
                            8.5,
                            0.5
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": {
                    "base": 1.2,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            20,
                            0.8
                        ]
                    ]
                }
            }
        },
        // 省道
        {
            id: "road_line_sd",
            type: "line",
            source: "road",
            "source-layer": "road_line_sd",
            minzoom: 7,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.5,
                    "stops": [
                        [
                            8.5,
                            0.5
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            20,
                            0.7
                        ]
                    ]
                }
            }
        },


        // 国道
        {
            id: "road_line_gd",
            type: "line",
            source: "road",
            "source-layer": "road_line_gd",
            minzoom: 7,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.6,
                    "stops": [
                        [
                            8.5,
                            0.5
                        ],
                        [
                            10,
                            0.75
                        ],
                        [
                            18,
                            20
                        ]
                    ]
                },
                "line-color": "#3c7e61",
                "line-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            0.6
                        ],
                        [
                            20,
                            0.8
                        ]
                    ]
                }
            }
        },
        // 高速公路
        {
            id: "road_line_gsgl",
            type: "line",
            source: "road",
            "source-layer": "road_line_gsgl",
            minzoom: 6,
            maxzoom: 19.01,
            "layout": {
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible"
            },
            "paint": {
                "line-width": {
                    "base": 1.5,
                    "stops": [
                        [
                            5,
                            0.75
                        ],
                        [
                            16,
                            18
                        ],
                        [
                            19, 22
                        ]
                    ]
                },
                "line-color": "#50a882",
                "line-opacity": {
                    base: 1,
                    stops: [
                        [6, 0.4],
                        [7, 0.6],
                        [9, 1]
                    ]
                }
            }
        },
        // 市区道路注记 13级
        {
            // 
            id: "road-sqdl-label2",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_sqdl",
            minzoom: 13,
            "layout": {
                "text-size": { base: 1, stops: [[9, 10], [20, 16]] },
                "text-max-angle": 30,
                "symbol-spacing": 360,
                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-field": "{NAME}",
                "text-letter-spacing": 0.01,
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        },
        // 县道注记
        {
            id: "road-xd-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_xd",
            minzoom: 13,
            "layout": {
                "text-size": { base: 1, stops: [[9, 10], [20, 16]] },
                "text-max-angle": 30,
                "symbol-spacing": 360,
                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-rotation-alignment": "map",
                "text-field": "{NAME}",
                "text-letter-spacing": 0.01,
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        },
        // 省道注记
        {
            id: "road-sd-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_sd",
            minzoom: 12,
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            9,
                            10
                        ],
                        [
                            20,
                            16
                        ]
                    ]
                },
                "text-max-angle": 30,
                "symbol-spacing": 360,
                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-field": "{NAME}",
                "symbol-avoid-edges": true
                // "text-rotation-alignment": "map"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1

            },
        },
        // 铁路注记
        {
            id: "road-railway-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_tl",
            minzoom: 10,
            "layout": {
                "text-size": {
                    "base": 1.3,
                    "stops": [
                        [
                            9,
                            13
                        ],
                        [
                            16,
                            15
                        ]
                    ]
                },
                "text-max-angle": 30,
                "symbol-spacing": 360,
                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-field": "{NAME}",
                // "text-rotation-alignment": "viewport"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1

            },
        },
        // 地铁注记
        {
            id: "road-subway-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_dt",
            minzoom: 10,
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            9,
                            13
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 30,
                "symbol-spacing": 320,

                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-field": "{NAME}",
                "text-rotation-alignment": "map"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1

            },
        },
        // 国道注记
        {
            id: "road-gd-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_gd",
            minzoom: 10,
            "layout": {
                "text-size": {
                    "base": 1.2,
                    "stops": [
                        [
                            9,
                            10
                        ],
                        [
                            16,
                            18
                        ],
                        [
                            18,
                            20
                        ]
                    ]
                },
                "text-max-angle": 30,
                "symbol-spacing": 360,

                "text-font": ["微软雅黑"],
                "symbol-placement": "line",
                "text-field": "{NAME}",
                // "text-rotation-alignment": "map"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1

            },
        },
        // 高速注记
        {
            id: "road-gs-label",
            type: "symbol",
            source: "road",
            "source-layer": "road_line_gsgl",
            minzoom: 8,
            layout: {
                "text-size": { base: 1, stops: [[7, 12], [16, 18], [18, 20]] },
                "text-max-angle": 30,
                "symbol-spacing": 400,
                "text-font": ["微软雅黑"],
                "symbol-placement": "line",

                // "text-rotation-alignment": "map",
                // "text-pitch-alignment": "viewport",
                "text-field": "{NAME}",
                "text-letter-spacing": 0.01
            },
            paint: {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        },


        // 建筑物轮廓3D
        {
            id: "jzw_region_lk",
            // 'type': 'fill',
            source: "jzw",
            "source-layer": "jzw_region_lk",
            type: "fill-extrusion",
            minzoom: 15,
            layout: { "visibility": 'visible' },
            paint: {
                "fill-extrusion-color": "hsl(154, 68%, 37%)",
                'fill-extrusion-height':
                    [
                        "interpolate", ["linear"], ["zoom"],
                        15, 0,
                        15.05, ['*', ["get", "FLOOR"], 3.2]
                    ],
                'fill-extrusion-base': 0,
                "fill-extrusion-opacity": 0.8,
                'fill-extrusion-translate-anchor': 'map',
                'fill-extrusion-vertical-gradient': false
            }
        },
        // 世界国家注记
        {
            id: "world_country_label1",
            type: "symbol",
            source: "world",
            "source-layer": "world_label",
            minzoom: 2,
            maxzoom: 10,
            filter: [
                "==",
                "TYPE",
                "国家"
            ],
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            2,
                            16
                        ],
                        [
                            12,
                            26
                        ]
                    ]
                },

                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],

                "text-anchor": 'center',
                "text-field": "{NAME}",
                "text-padding": 25,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 中国注记
        {
            id: "china_label",
            type: "symbol",
            source: "world",
            "source-layer": "world_label",
            minzoom: 2,
            maxzoom: 3,
            filter: [
                "==",
                "TYPE",
                "中国"
            ],
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            2,
                            18
                        ],
                        [
                            8,
                            26
                        ]
                    ]
                },

                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],

                "text-anchor": 'center',
                "text-field": "{NAME}",
                "text-padding": 25,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 中国省名注记
        {
            id: "china_province_label",
            type: "symbol",
            source: "world",
            "source-layer": "world_label",
            minzoom: 3,
            maxzoom: 4,
            filter: [
                "==",
                "TYPE",
                "省"
            ],
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            3,
                            14
                        ],
                        [
                            8,
                            20
                        ]
                    ]
                },

                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],

                "text-anchor": 'center',
                "text-field": "{NAME}",
                "text-padding": 10,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 中国省会注记
        {
            id: "china_province_capital_label",
            type: "symbol",
            source: "world",
            "source-layer": "world_label",
            minzoom: 4,
            maxzoom: 5.5,
            filter: [
                "==",
                "TYPE",
                "省会"
            ],
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            3,
                            14
                        ],
                        [
                            8,
                            20
                        ]
                    ]
                },

                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],

                "text-anchor": 'center',
                "text-field": "{NAME}",
                "text-padding": 10,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 中国市名注记
        {
            id: "china_city_label",
            type: "symbol",
            source: "world",
            "source-layer": "world_label",
            minzoom: 5.5,
            maxzoom: 9,
            filter: [
                "==",
                "TYPE",
                "市"
            ],
            "layout": {
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            5,
                            14
                        ],
                        [
                            8,
                            20
                        ]
                    ]
                },

                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],

                "text-anchor": 'center',
                "text-field": "{NAME}",
                "text-padding": 10,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1, "text-halo-blur": 1,

                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 区县
        {
            id: "xzbz_point_qx",
            type: "symbol",
            source: "xzbz",
            "source-layer": "xzbz_point_qx",
            maxzoom: 10,
            minzoom: 7.5,
            "layout": {
                "symbol-sort-key": 2,
                "text-size": {
                    "base": 1.25,
                    "stops": [
                        [
                            5,
                            14
                        ],
                        [
                            12,
                            26
                        ]
                    ]
                },
                "icon-offset": [
                    -12,
                    -3
                ],
                "icon-image": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            "point-small"
                        ],
                        [
                            12,
                            ""
                        ]
                    ]
                },
                "text-font": [
                    "微软雅黑"
                ],
                "text-offset": [
                    0,
                    0
                ],
                "icon-size": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            0.5
                        ],
                        [
                            12,
                            1
                        ]
                    ]
                },
                "text-anchor": {
                    "base": 1,
                    "stops": [
                        [
                            0,
                            "left"
                        ],
                        [
                            5,
                            "center"
                        ]
                    ]
                },
                "text-field": "{NAME}",
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-translate": [
                    0,
                    0
                ]
            },
        },

        // // 岛屿注记
        {
            id: "dtbj_region_dy_label",
            type: "symbol",
            source: "dtbj",
            "source-layer": "dtbj_region_dy",
            minzoom: 10,
            "layout": {
                'text-padding': {
                    stops: [
                        [8, 10],
                        [12, 40],
                        [14, 100]
                    ]
                },
                'text-anchor': 'center',
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            7,
                            12
                        ],
                        [
                            15,
                            20
                        ]
                    ]
                },
                "text-font": ["微软雅黑"],
                "text-max-width": 8,
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            },
        },
        // 山
        {
            id: "poi_shan",
            type: "symbol",
            source: "poi",
            "source-layer": "poi_shan",
            minzoom: 9.8,
            maxzoom: 19.01,
            "layout": {
                "text-field": "{NAME}",
                "visibility": 'visible',
                "text-font": [
                    "微软雅黑"
                ],
                "text-max-width": 8,
                "text-size": {
                    "base": 1.2,
                    "stops": [
                        [
                            11,
                            14
                        ],
                        [
                            18,
                            20
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-padding": 30,
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#50a882"
            },
        },

        // 河流注记1
        {
            id: "dtbj_region_hl_label1",
            type: "symbol",
            source: "dtbj",
            "source-layer": "dtbj_region_hl",
            "minzoom": 11.01,
            "layout": {
                "text-field": "{NAME}",
                "text-font": [
                    "微软雅黑"
                ],
                // "symbol-placement": "point",
                "text-pitch-alignment": "auto",
                "text-max-angle": 30,
                "text-padding": 0,
                // "symbol-placement": "line-center",
                // "text-rotation-alignment": "viewport",
                // "symbol-placement": "line",
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            12,
                            12
                        ],
                        [
                            16,
                            18
                        ]
                    ]
                }
            },
            "paint": {
                "text-color": "#50a882"
            },
        },
        // 湖泊注记
        {
            id: "dtbj_region_hpsk_label",
            "type": "symbol",
            source: "dtbj",
            "source-layer": "dtbj_region_hpsk",
            minzoom: 9,
            maxzoom: 19.01,
            filter: [
                "==",
                "KIND",
                '0122'
            ], "layout": {
                "text-field": "{NAME}",
                "text-font": ["微软雅黑"],
                "text-max-width": 8,
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            12,
                            14
                        ],
                        [
                            16,
                            18
                        ]
                    ]
                },

                "text-rotation-alignment": "viewport",
                "text-padding": 66
                // "symbol-placement": "line-center",
                // "text-rotation-alignment": "map"
            },
            "paint": {
                "text-color": "#50a882"
            },
        },
        // // 乡镇注记
        {
            id: "xzbz_point_town",
            type: "symbol",
            source: "xzbz",
            "source-layer": "xzbz_point_jdxz",
            minzoom: 9.5,
            maxzoom: 14,
            // "minzoom": 6,
            "layout": {
                "symbol-sort-key": 2,
                'text-padding': 25,
                'text-anchor': 'center',
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            7,
                            12
                        ],
                        [
                            15,
                            20
                        ]
                    ]
                },
                "text-font": ["微软雅黑"],
                "text-max-width": 8,
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}"
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1
            },
        },
        // // 村庄
        {
            id: "xzbz_point_village",
            type: "symbol",
            source: "xzbz",
            "source-layer": "xzbz_point_cz",
            minzoom: 12.5,
            maxzoom: 17,
            "layout": {
                "text-field": "{NAME}",
                "visibility": 'visible',
                "text-font": [
                    "微软雅黑"
                ],
                "text-max-width": 8,
                "text-size": {
                    "base": 1.1,
                    "stops": [
                        [
                            10,
                            11
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-padding": 30,
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-color": "#50a882"
            },
        },
        // 宾馆酒店
        {
            "id": "poi_bgjd",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_bgjd",
            minzoom: 15,
            // filter: [
            //     "in", "TYPE", "A700", "A702"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 2,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 餐饮服务
        {
            "id": "poi_cyfw",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_cyfw",
            minzoom: 15,
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 3,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 25,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 公司企业
        {
            "id": "poi_gsqy",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_gsqy",
            minzoom: 15,
            // filter: [
            //     "in", "TYPE", "A700", "A702"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 2,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,

                "text-halo-width": 1
            }
        },
        // 商业大厦
        {
            "id": "poi_syds",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_syds",
            minzoom: 15,
            // filter: [
            //     "in", "TYPE", "A700", "A702"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 2,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 科研教育
        {
            "id": "poi_kyjy",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_kyjy",
            minzoom: 15,
            // filter: [
            //     "in", "TYPE", "A700", "A702"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 2,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 医疗服务
        {
            "id": "poi_ylfw",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_ylfw",
            minzoom: 15,
            // filter: [
            //     "in", "CFL", "妇幼保健", "急救中心", "康复中心", "疗养院", "专科医院", "综合一级医院", "综合二级医院", "综合三级医院", "综合医院"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 1.5,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 金融服务
        {
            "id": "poi_jrfw",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_jrfw",
            minzoom: 15,
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 2,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 25,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,

                "text-halo-width": 1
            }
        },

        // 住宅小区
        {
            "id": "poi_zzxq",
            "type": "symbol",
            "source": "poi",
            "source-layer": "poi_zzxq",
            minzoom: 14,
            // filter: [
            //     "in", "TYPE", "A700", "A702"
            // ],
            "layout": {
                "visibility": 'visible',
                "text-line-height": 1,
                "text-size": {
                    "base": 1.4,
                    "stops": [
                        [
                            14,
                            14
                        ],
                        [
                            18,
                            16
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-font": ['微软雅黑'],
                "text-offset": [
                    0,
                    0
                ],
                "text-field": "{NAME}",
                "text-padding": 25,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        // 港口码头
        {
            id: "poi_gkmt",
            type: "symbol",
            source: "poi",
            "source-layer": "poi_gkmt",
            minzoom: 11,
            maxzoom: 19.01,
            "layout": {
                "symbol-sort-key": 3,
                "text-field": "{NAME}",
                "visibility": 'visible',
                "text-font": [
                    "微软雅黑"
                ],
                "text-max-width": 8,
                "text-size": {
                    "base": 5,
                    "stops": [
                        [
                            11,
                            14
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-padding": 15,
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#50a882"
            },
        },

        // 政府机构
        {
            id: "xzbz_point_zfjg",
            type: "symbol",
            source: "xzbz",
            "source-layer": "xzbz_point_zfjg",
            minzoom: 14.5,
            maxzoom: 19.01,
            "layout": {
                "symbol-sort-key": 0,
                "text-field": "{NAME}",
                "visibility": 'visible',
                "text-font": [
                    "微软雅黑"
                ],
                "text-max-width": 8,
                "text-size": {
                    "base": 1.1,
                    "stops": [
                        [
                            11,
                            14
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-padding": 10,
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-color": "#50a882"
            },
        },

        // 火车站地铁站
        {
            "id": "xzbz_point_hczdtz",
            "type": "symbol",
            "source": "xzbz",
            "source-layer": "xzbz_point_hczdtz",
            "minzoom": 13,
            "layout": {
                "symbol-sort-key": 1,
                "text-field": "{NAME}",
                "text-max-width": 8,
                "text-letter-spacing": 0.15,
                "text-line-height": 1.5,
                "text-font": ["微软雅黑"],
                "text-size": {
                    "base": 4,
                    "stops": [
                        [
                            7,
                            14
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-width": 1,
                "text-halo-color": "hsl(0, 0%, 0%)",

            },
        },
        // 机场
        {
            "id": "xzbz_point_jc",
            "type": "symbol",
            "source": "xzbz",
            "source-layer": "xzbz_point_jc",
            "minzoom": 10,
            "layout": {
                "symbol-sort-key": 1,
                "text-field": "{NAME}",
                "text-max-width": 8,
                "text-letter-spacing": 0.15,
                "text-line-height": 1.5,
                "text-font": ["微软雅黑"],
                "text-size": {
                    "base": 4,
                    "stops": [
                        [
                            7,
                            14
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
            },
            "paint": {
                "text-color": "#50a882",
                "text-halo-width": 1,
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-translate": [
                    0,
                    0
                ]
            },
        },
        // 海洋注记
        {
            id: "poi_sea",
            type: "symbol",
            source: "poi",
            "source-layer": "poi_sea",
            minzoom: 9,
            maxzoom: 19.01,
            "layout": {
                "symbol-sort-key": 0,
                "text-field": "{NAME}",
                "visibility": 'visible',
                "text-font": [
                    "微软雅黑"
                ],
                "text-max-width": 8,
                "text-size": {
                    "base": 1.1,
                    "stops": [
                        [
                            11,
                            14
                        ],
                        [
                            18,
                            18
                        ]
                    ]
                },
                "text-max-angle": 38,
                "text-padding": 10,
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 0%)",
                "text-halo-width": 1,
                "text-color": "#50a882"
            },
        },

    ]
};

export { decimal_T }