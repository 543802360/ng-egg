
/**
 * 获取颜色带
 */

const COLORS = {
    'primary': [
        "#D6E4FF",
        "#ADC8FF",
        "#84A9FF",
        "#6690FF",
        "#3366FF",
        "#254EDB",
        "#1939B7",
        "#102693",
        "#091A7A",
    ],
    'success': [
        "#EBFBD5",
        "#D3F8AB",
        "#AFEC7E",
        "#8BD95B",
        "#5BC12C",
        "#41A520",
        "#2B8A16",
        "#196F0E",
        "#0C5C08",
    ],
    'info': [
        "#D7FEF5",
        "#AFFDF2",
        "#86FBF4",
        "#67F4F7",
        "#37DFF2",
        "#28B1D0",
        "#1B87AE",
        "#11628C",
        "#0A4774",
    ],
    'warn': [
        "#FEF9CF",
        "#FEF29F",
        "#FEE96F",
        "#FDE04C",
        "#FCD111",
        "#D8AF0C",
        "#B58F08",
        "#927005",
        "#785A03",
    ],
    'danger': [
        "#FFE9D5",
        "#FFCDAB",
        "#FFAB81",
        "#FF8A61",
        "#FF542D",
        "#DB3520",
        "#B71C16",
        "#930E13",
        "#7A0815",
    ]
}


export function getColorRange(min: number, max: number, type: string = 'danger') {

    const range = Math.abs(max - min);
    const arr = [];
    const data = Math.floor(range / 5);
    for (let i = 0; i < 6; i++) {
        arr.push([Math.floor(min + data * i), COLORS[type][i]]);
    }
    return arr;
}