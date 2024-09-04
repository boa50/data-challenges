import { addAxis } from "../../node_modules/visual-components/index.js"

export const prepareAxis = (data, width, height) => {
    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.total) * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(data.map(d => d.food))
        .range([0, height])
        .padding(.1)

    return { x, y }
}

export const plotAxis = (chart, width, height, palette, x, y) => {
    addAxis({
        chart,
        width,
        height,
        colour: palette.axis,
        fontSize: '0.65rem',
        x,
        y,
        xLabel: 'CO₂-equivalents kg per food kg',
        yLabel: 'Food',
        xNumTicks: 5,
        xNumTicksForceInitial: true,
        hideXdomain: true,
        hideYdomain: true
    })
}