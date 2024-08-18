export const animateSingleLine = (path, transition) => {
    const pathLength = path.node().getTotalLength()

    path
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength)
        .transition(transition)
        .attr('stroke-dashoffset', 0)
}

export const animateMultipleLines = (chart, keyframes, x, y, colour) => {
    const playChart = async () => {
        const lineChartFuncs = createLineChart(chart, x, y, colour)

        for (let i = 1; i < keyframes.length; i++) {
            const keyframeData = []
            keyframes.slice(0, i)
                .forEach(d => d[1].forEach(v => { keyframeData.push({ date: d[0], group: v.group, value: v.value }) }))

            const transition = chart
                .transition()
                .duration(0)
                .ease(d3.easeLinear)

            updateLineChart(lineChartFuncs, keyframeData, transition)

            await transition.end()
        }
    }

    playChart()
}


function lines(chart, x, y, colour) {
    let line = chart
        .selectAll('.data-point')

    return data => line = line
        .data(d3.group(data, d => d.group))
        .join('path')
        .attr('class', 'data-point')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 1)
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

function createLineChart(chart, x, y, colour) {
    const updateLines = lines(chart, x, y, colour)
    // const updateLabels = labels(svg, prev, next)
    // const updateImages = images(svg, prev, next)
    // const updateAxis = axis(svg)
    // const updateTicker = ticker(svg, keyframes)

    return { updateLines }
}

function updateLineChart(lineChartFuncs, keyframe) {
    // const { updateBars, updateLabels, updateImages, updateAxis, updateTicker } = lineChartFuncs
    const { updateLines } = lineChartFuncs

    // Extract the top bar’s value
    // x.domain([0, keyframe[1][0].value])

    updateLines(keyframe)
    // updateLabels(keyframe, transition)
    // updateImages(keyframe, transition)
    // updateAxis(keyframe, transition)
    // updateTicker(keyframe, transition)
}