import { prepareData } from "./prepareData.js"

export const animateSingleLine = (path, transition) => {
    const pathLength = path.node().getTotalLength()

    path
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength)
        .transition(transition)
        .attr('stroke-dashoffset', 0)
}

export const animateMultipleLines = ({
    chart,
    data,
    dateField = undefined,
    yearField = undefined,
    isRankedData = false,
    x,
    y,
    updateAxis,
    lineAttrs
}) => {
    const { keyframes } = prepareData({
        data,
        dateField,
        yearField,
        isRankedData
    })

    const runChart = async () => {
        const updateLines = createLineChart(chart, x, y, lineAttrs)

        for (let i = 1; i < keyframes.length; i++) {
            const keyframeData = []
            keyframes.slice(0, i)
                .forEach(d => d[1].forEach(v => { keyframeData.push({ date: d[0], group: v.group, value: v.value }) }))

            const transition = chart
                .transition()
                .duration(0)
                .ease(d3.easeLinear)

            updateLineChart(updateLines, keyframeData, updateAxis, x, y)

            await transition.end()
        }
    }

    runChart()
}


function createLineChart(chart, x, y, lineAttrs) {
    let line = chart
        .selectAll('.data-point')

    return data => line = line
        .data(d3.group(data, d => d.group))
        .join('path')
        .attr('class', 'data-point')
        .attr('fill', 'none')
        .call(line => lineAttrs(line))
        .call(
            line => line
                .attr('d', d => d3
                    .line()
                    .x(d => x(d.date))
                    .y(d => y(d.value))
                    (d[1])
                )
        )
}

function updateLineChart(updateLines, keyframe, updateAxis, x, y) {
    updateLines(keyframe)

    if (updateAxis !== undefined) {
        x.domain(d3.extent(keyframe, d => d.date))
        y.domain([0, d3.max(keyframe, d => d.value)].map(d => d * 1.05))
        updateAxis(keyframe)
    }
}