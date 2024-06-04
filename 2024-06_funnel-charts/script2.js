import { getChart, getMargin, addAxis } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"
import { data } from "./data.js"

const { chart, width, height } = getChart({
    id: 'chart2',
    margin: getMargin({ left: 128, bottom: 52, top: 0, right: 32 })
})

const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, width])

const y = d3
    .scaleBand()
    .domain(data.map(d => d.step))
    .range([0, height])
    .padding(.2)

chart
    .selectAll('.data-point')
    .data(data)
    .join('rect')
    .attr('x', d => x(0))
    .attr('y', d => y(d.step))
    .attr('width', d => x(d.value))
    .attr('height', y.bandwidth())
    .attr('fill', (d, i) => d3.hsl(palette.orange).darker((Math.abs(i - data.length) * 2) / 10))

addAxis({
    chart,
    height,
    width,
    x,
    y,
    hideXdomain: true,
    hideYdomain: true,
    xNumTicks: 5,
    xFormat: d => `${d}%`,
    fontSize: '0.9rem',
    colour: palette.axis,
})

chart
    .selectAll('.data-values')
    .data(data)
    .join('text')
    .attr('class', 'font-bold')
    .attr('x', d => x(d.value) / 2)
    .attr('y', d => y(d.step) + y.bandwidth() / 2)
    .attr('fill', '#FFFFFF')
    .attr('font-size', '1rem')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(d => `${d.value}%`)

const getLinkPath = (d, i) => {
    if (data[i + 1] !== undefined) {
        return `
        M ${x(0)} ${y(d.step) + y.bandwidth()} 
        H ${x(d.value)} 
        L ${x(data[i + 1].value)} ${y(data[i + 1].step)} 
        H ${x(0)} Z
        `
    }
}

chart
    .selectAll('.link-points')
    .data(data.slice(0, -1))
    .join('path')
    .attr('fill', d3.hsl(palette.orange + '70').brighter(0.1))
    .attr('d', (d, i) => getLinkPath(d, i))