import { colours } from '../node_modules/visual-components/index.js'
import { prepareData, plotGraph, addLabels, prepareAxis, plotAxis, plotLegend } from './components/script.js'

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height, margin } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await prepareData()
    const subgroups = Object.keys(data[0]).slice(1, -1)

    const colour = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([palette.vermillion, palette.bluishGreen, palette.amber, d3.hsl(palette.axis).brighter(1.5)])

    const { x, y } = prepareAxis(data, width, height)
    plotGraph(chart, data, subgroups, x, y, colour, width, height, margin, palette)
    addLabels(chart, width, height, palette)
    plotAxis(chart, width, height, palette, x, y)
    plotLegend(chart, colour.range(), margin)
}