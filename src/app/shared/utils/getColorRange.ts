
const colorStops =
    [
        "rgb(1, 152, 189)",
        "rgb(73, 227, 206)",
        "rgb(216, 254, 181)",
        "rgb(254, 237, 177)",
        "rgb(254, 173, 84)",
        "rgb(209, 55, 78)"
    ];
export function getColorRange(min: number, max: number) {

    const range = Math.abs(max - min);
    const arr = [];
    const data = Math.floor(range / 5);
    for (let i = 0; i < 6; i++) {
        arr.push([Math.floor(min + data * i), colorStops[i]]);
    }
    return arr;
}