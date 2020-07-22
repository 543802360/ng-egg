const tdtSources = {
    type: 'raster',
    // scheme: 'tms',
    tiles:
        [
            'https://t1.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t2.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t3.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t5.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t6.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',
            'https://t7.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=113dc1c97c350f394a353184e3f7f6e4',

        ],
    "tileSize": 256
}

export { tdtSources }