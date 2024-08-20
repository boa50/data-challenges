import { prepareData } from "./data.js"
import { createAreaChart, updateAreaChart } from "./area.js"

export const run = ({
    chart,
    data,
    dateField = undefined,
    yearField = undefined,
    isRankedData = false,
    x,
    y,
    updateAxis,
    customAttrs,
    addCustom = () => { }
}) => {
    const { keyframes, groups } = prepareData({
        data,
        dateField,
        yearField,
        isRankedData
    })

    const runChart = async () => {
        const updateArea = createAreaChart(chart, x, y, customAttrs)

        for (let i = 1; i < keyframes.length; i++) {
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

            addCustom(keyframeData, x, y)

            await transition.end()
        }
    }

    runChart()
}