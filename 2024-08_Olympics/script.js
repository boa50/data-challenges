import { getChart, appendChartContainer, addAxis, getMargin } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

const getData = () =>
    d3.csv('data/dataset.csv')
        .then(d => d.map(v => { return { ...v, male: +v.male * -1, female: +v.female } }))

const streamgraph = appendChartContainer({ idNum: 1, chartTitle: 'Diverging chart' })

getData().then(data => {
    const { chart, width, height } = getChart({ id: streamgraph, margin: getMargin({ left: 64 }) })

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.male), -d3.min(data, d => d.male)].map(d => d * 1.05))
        .range([height, 0])

    const keys = Object.keys(data[0]).slice(1)

    const colour = d3
        .scaleOrdinal()
        .domain(keys)
        .range([palette.reddishPurple, palette.blue])

    const stackedData = d3
        .stack()
        .offset(d3.stackOffsetDiverging)
        .keys(keys)
        (data)

    const area = d3
        .area()
        .x(d => x(d.data.year))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))


    chart
        .selectAll('data-points')
        .data(stackedData)
        .join('path')
        .style('fill', d => colour(d.key))
        .attr('d', area)

    // Adding legend directly on the chart
    const addLegend = txt => {
        chart
            .append('text')
            .attr('x', x('2000'))
            .attr('y', y(txt === 'Women' ? 800 : -1000))
            .attr('font-size', '2rem')
            .attr('fill', '#FFFFFF')
            .attr('font-weight', 500)
            .attr('dominant-baseline', 'middle')
            .attr('opacity', 0.85)
            .text(txt)
    }

    addLegend('Women')
    addLegend('Men')

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Number of Athletes',
        xFormat: d => d,
        yFormat: d => d3.format('.1s')(Math.abs(d)),
        hideXdomain: true,
        hideYdomain: true,
    })
})
