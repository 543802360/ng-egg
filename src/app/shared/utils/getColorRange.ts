
/**
 * 获取颜色带
 */

const enum ColorTypes {
    'primary' = 'primary',
    'success' = 'success',
    'info' = 'info',
    'baronRedBlue' = 'baronRedBlue',
    'warn' = 'warn',
    'danger' = 'danger',
    'regular' = 'regular'
}

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
        "#F0FDD3",
        "#DEFCA8",
        "#C4F77C",
        "#AAEF5A",
        "#83E527",
        "#65C41C",
        "#4BA413",
        "#34840C",
        "#246D07",
    ],
    'info': [

        "#FC0000",
        "#FC3500",
        "#FC6B00",
        "#FCAC00",
        "#FCF900",
        "#71FC00",
        "#00FC90",
        "#00EDFC",
        "#008EFC",
    ],
    'baronRedBlue': [
        "#CFFFFD",
        "#9FFBFF",
        "#70EFFF",
        "#4CDEFF",
        "#11C3FF",
        "#0C98DB",
        "#0872B7",
        "#055193",
        "#033A7A",
    ],
    'warn': [
        "#FEF7DA",
        "#FEEEB5",
        "#FEE28F",
        "#FDD574",
        "#FCC246",
        "#D89E33",
        "#B57D23",
        "#925E16",
        "#78480D",
    ],
    'danger': [
        "#00fff0",
        "#00deff",
        "#00baff",
        "#0090ff",
        "#008aff",
        "#004eff",
        "#0c00ff",
        "#4800ff",
        "#6600ff",
    ],
    'regular': [
        "rgb(1, 152, 189)",
        "rgb(73, 227, 206)",
        "rgb(216, 254, 181)",
        "rgb(254, 237, 177)",
        "rgb(254, 173, 84)",
        "rgb(209, 55, 78)"
    ]

}


function getColorRange(min: number, max: number, type: ColorTypes = ColorTypes.danger) {

    const range = Math.abs(max - min);
    const arr = [];

    if (type === ColorTypes.regular) {
        const data = Math.floor(range / 5);
        for (let i = 0; i < 6; i++) {
            arr.push([Math.floor(min + data * i), COLORS[type][i]]);
        }
    } else {
        const data = Math.floor(range / 9);
        for (let i = 0; i < 9; i++) {
            arr.push([Math.floor(min + data * i), COLORS[type][i]]);
        }
    }

    return arr;
}

export { getColorRange, COLORS, ColorTypes }