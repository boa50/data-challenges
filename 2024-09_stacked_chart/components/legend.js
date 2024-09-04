import { addLegend } from "../../node_modules/visual-components/index.js"

export const plotLegend = (chart, colours, margin) => {
    addLegend({
        chart,
        legends: ['Land Use Change', 'Farm', 'Animal Feed', 'Others'],
        colours,
        xPosition: -margin.left,
        fontSize: '0.65rem'
    })
}