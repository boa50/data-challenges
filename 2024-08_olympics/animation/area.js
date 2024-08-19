import { prepareData } from "./prepareData.js"

export const animateArea = ({
    chart,
    data,
    dateField = undefined,
    yearField = undefined,
    isRankedData = false,
    x,
    y,
    updateAxis,
    areaAttrs
}) => {
    const { keyframes, groups } = prepareData({
        data,
        dateField,
        yearField,
        isRankedData
    })

    const runChart = async () => {
        const updateArea = createAreaChart(chart, x, y, areaAttrs)

        for (let i = 1; i < keyframes.length; i++) {
            // for (let i = 1; i < 20; i++) {
            const keyframeData = []
            keyframes.slice(0, i)
                .forEach(d => d[1].forEach(v => { keyframeData.push({ date: d[0], group: v.group, value: v.value }) }))

            const stackedData = d3
                .stack()
                .offset(d3.stackOffsetDiverging)
                .keys(groups)
                .value(([, group], key) => group.get(key).value)
                (d3.index(keyframeData, d => d.date, d => d.group))

            const transition = chart
                .transition()
                .duration(0)
                .ease(d3.easeLinear)

            updateAreaChart(updateArea, stackedData, updateAxis, x, y)

            await transition.end()
        }
    }

    runChart()
}


function createAreaChart(chart, x, y, areaAttrs) {
    let area = chart
        .selectAll('.data-point')

    const areaGenerator = d3
        .area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    return stackedData => area = area
        .data(stackedData)
        .join('path')
        .attr('class', 'data-point')
        .call(area => areaAttrs(area))
        .call(
            area => area.attr('d', areaGenerator)
        )
}

function updateAreaChart(updateArea, stackedData, updateAxis, x, y) {
    updateArea(stackedData)

    const dates = new Set()
    stackedData.forEach(d => d.forEach(v => dates.add(v.data[0])))
    const maxValue = d3.max(d3.union(...stackedData.map(d => d.map(v => d3.max(v, v2 => Math.abs(v2))))), d => d)

    if (updateAxis !== undefined) {
        x.domain(d3.extent([...dates], d => d))
        y.domain([-maxValue, maxValue].map(d => d * 1.05))
        updateAxis(stackedData)
    }
}