import { getChart, appendChartContainer, addAxis, getMargin } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"
import { prepareLineData } from "./animation/prepareData.js"
import { animateSingleLine } from "./animation/line.js"

const getData = () =>
    d3.csv('data/dataset.csv')
        .then(d => {
            const long_data = []
            d.forEach(row => {
                Object.keys(row).forEach(colname => {
                    if (colname !== 'year')
                        long_data.push({
                            'year': row['year'],
                            'group': colname,
                            'value': colname === 'male' ? +row[colname] : +row[colname]
                        })
                })
            })

            return long_data
        })

const streamgraph = appendChartContainer({ idNum: 2, chartTitle: 'Diverging chart - Animated' })

const lines = (chart, data, prev, next, x, y) => {
    let line = chart
        .selectAll('.data-point')

    const dataPerGroup = d3.group(data, d => d.group)
    const colour = d3
        .scaleOrdinal()
        .range([palette.reddishPurple, palette.blue])

    const lineGenerator = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.value))

    // chart
    //     .selectAll('.data-point')
    //     .data(dataPerGroup)
    //     .join('path')
    //     .attr('class', 'data-point')
    //     .attr('fill', 'none')
    //     .attr('stroke', d => colour(d[0]))
    //     .attr('stroke-width', 1)
    //     .attr('d', d => lineGenerator(d[1]))

    return ([date, data], transition) => line = line
        .data(dataPerGroup)
        .join('path')
        .attr('class', 'data-point')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 1)
        .attr('d', d => lineGenerator(d[1]))
    // .data(data.slice(0, n), d => d.name)
    // .join(
    //     enter => enter
    //         .append('rect')
    //         .attr('fill', d => colour(rawData, d))
    //         .attr('height', y.bandwidth())
    //         .attr('x', x(0))
    //         .attr('y', d => y(getRank(prev, d)))
    //         .attr('width', d => x(getValue(prev, d)) - x(0)),
    //     update => update,
    //     exit => exit
    //         .transition(transition)
    //         .remove()
    //         .attr('y', d => y(getRank(next, d)))
    //         .attr('width', d => x(getValue(next, d)) - x(0))
    // )
    // .call(
    //     bar => bar
    //         .transition(transition)
    //         .attr('y', d => y(d.rank))
    //         .attr('width', d => x(d.value) - x(0))
    // )
}

const createLineChart = (chart, data, keyframes, prev, next, x, y) => {
    const updateLines = lines(chart, data, prev, next, x, y)
    // const updateLabels = labels(svg, prev, next)
    // const updateImages = images(svg, prev, next)
    // const updateAxis = axis(svg)
    // const updateTicker = ticker(svg, keyframes)

    return { updateLines }
}

const updateLineChart = (lineChartFuncs, keyframe, transition) => {
    // const { updateBars, updateLabels, updateImages, updateAxis, updateTicker } = lineChartFuncs
    const { updateLines } = lineChartFuncs

    // Extract the top bar’s value
    // x.domain([0, keyframe[1][0].value])

    updateLines(keyframe, transition)
    // updateLabels(keyframe, transition)
    // updateImages(keyframe, transition)
    // updateAxis(keyframe, transition)
    // updateTicker(keyframe, transition)
}

getData().then(data => {
    const { chart, width, height } = getChart({ id: streamgraph, margin: getMargin({ left: 64 }) })

    const duration = 250
    // const length = 100

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)].map(d => d * 1.05))
        .range([height, 0])

    const { keyframes, prev, next } = prepareLineData(data, undefined, 'year', false)

    const playChart = async () => {
        const lineChartFuncs = createLineChart(chart, data, keyframes, prev, next, x, y)

        for (const keyframe of keyframes) {
            const transition = chart
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)

            updateLineChart(lineChartFuncs, keyframe, transition)

            await transition.end()
        }
    }

    playChart()



    // const dataPerGroup = d3.group(data, d => d.group)
    // const colour = d3
    //     .scaleOrdinal()
    //     .range([palette.reddishPurple, palette.blue])

    // const x = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, d => d.year))
    //     .range([0, width])

    // const y = d3
    //     .scaleLinear()
    //     .domain([0, d3.max(data, d => d.value)].map(d => d * 1.05))
    //     .range([height, 0])

    // const transitionLine = chart
    //     .transition()
    //     .duration(duration * (length + 4))
    //     .ease(d3.easeLinear)

    // const line = d3
    //     .line()
    //     .x(d => x(d.year))
    //     .y(d => y(d.value))

    // const path = chart
    //     .selectAll('.drewLine')
    //     .data(dataPerGroup)
    //     .join('path')
    //     .attr('fill', 'none')
    //     .attr('stroke', d => colour(d[0]))
    //     .attr('stroke-width', 1)
    //     .attr('d', d => line(d[1]))


    // animateSingleLine(path, transitionLine)





    // const transitionLine = chart
    //     .transition()
    //     .duration(duration * (length + 4))
    //     .ease(d3.easeLinear)

    // const x = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, d => d.year))
    //     .range([0, width])

    // const y = d3
    //     .scaleLinear()
    //     .domain([d3.min(data, d => d.male), -d3.min(data, d => d.male)].map(d => d * 1.05))
    //     .range([height, 0])

    // const keys = Object.keys(data[0]).slice(1)

    // const colour = d3
    //     .scaleOrdinal()
    //     .domain(keys)
    //     .range([palette.reddishPurple, palette.blue])

    // const stackedData = d3
    //     .stack()
    //     .offset(d3.stackOffsetDiverging)
    //     .keys(keys)
    //     (data)

    // const area = d3
    //     .area()
    //     .x(d => x(d.data.year))
    //     .y0(d => y(d[0]))
    //     .y1(d => y(d[1]))


    // const path = chart
    //     .selectAll('data-points')
    //     .data(stackedData)
    //     .join('path')
    //     .style('fill', d => colour(d.key))
    //     .attr('d', area)

    // const pathLength = path.node().getTotalLength()
    // console.log(pathLength);

    // path
    //     .attr('stroke-dashoffset', pathLength)
    //     .attr('stroke-dasharray', pathLength)
    //     .transition(transitionLine)
    //     .attr('stroke-dashoffset', 0)

    // Adding legend directly on the chart
    // const addLegend = txt => {
    //     chart
    //         .append('text')
    //         .attr('x', x('2000'))
    //         .attr('y', y(txt === 'Women' ? 800 : -1000))
    //         .attr('font-size', '2rem')
    //         .attr('fill', '#FFFFFF')
    //         .attr('font-weight', 500)
    //         .attr('dominant-baseline', 'middle')
    //         .attr('opacity', 0.85)
    //         .text(txt)
    // }

    // addLegend('Women')
    // addLegend('Men')

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
