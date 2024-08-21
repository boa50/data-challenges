import { addAxis, getBeginingYearDate, runRaceChart } from "../../../node_modules/visual-components/index.js"
import { palette as paletteLightBg, paletteDarkBg } from "../../../colours.js"
import { updateAxis } from "./axis.js"
import { addAnnotation, updateAnnotationPosition, addDataPoint, updateDataPointPosition } from "./annotation.js"


export const plot = (chartProps, data, theme) => {
    const { chart, width, height } = chartProps

    const lastYearData = data.filter(d => d.year === '2024')
    const lastYearValues = {
        female: lastYearData.filter(d => d.group === 'female')[0].value,
        male: lastYearData.filter(d => d.group === 'male')[0].value
    }

    let palette = paletteLightBg
    if (theme === 'dark') palette = paletteDarkBg

    const x = d3
        .scaleLinear()
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)].map(d => d * 1.05))
        .range([height, 0])

    const colour = d3
        .scaleOrdinal()
        .range([palette.reddishPurple, palette.blue])

    const xFormat = d3.utcFormat("%Y")
    const yFormat = d => d3.format('.1s')(Math.abs(d))

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        fontSize: '0.7rem',
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Number of Athletes',
        xFormat,
        yFormat,
        hideXdomain: true,
        hideYdomain: true,
    })

    runRaceChart({
        type: 'area',
        chart,
        data,
        yearField: 'year',
        x,
        y,
        updateAxis: stackedData => updateAxis(stackedData, chart, x, y, xFormat, yFormat),
        customAttrs: path => path
            .attr('fill', d => colour(d.key)),
        addCustom: (data, x, y) => addCustomElements({ data, x, y, chart, height, width, lastYearValues, colour })
    })

    addLegend(chart, y, 'Women', colour)
    addLegend(chart, y, 'Men', colour)
}

function addCustomElements({ data, x, y, chart, height, width, lastYearValues, colour }) {
    const lastYear = d3.max(data, d => d.date.getFullYear())

    // Adding specific points with annotations
    const configureAnnotation = (dt, txt, textWidth) => {
        if (lastYear >= dt) {
            const id = `annotation-${dt}`
            const year = getBeginingYearDate(dt)

            if (chart.select(`#${id}`).empty()) {
                addAnnotation({
                    id,
                    chart,
                    height,
                    year,
                    txt,
                    x,
                    textWidth
                })
            } else {
                updateAnnotationPosition(id, chart, x, year)
            }
        }
    }
    configureAnnotation(1996, 'Promoting women becomes a mission of the IOC')
    configureAnnotation(1964, 'Women represented 13% of the participants', 120)
    configureAnnotation(1900, 'First modern games featuring female athletes')

    // Adding end point data
    if (lastYear >= 2016) {
        if (chart.select('#data-point-female').empty()) {
            addDataPoint(chart, 'female', x, y, lastYearValues, colour)
            addDataPoint(chart, 'male', x, y, lastYearValues, colour)
        } else {
            updateDataPointPosition(chart, 'female', x, y, lastYearValues)
            updateDataPointPosition(chart, 'male', x, y, lastYearValues)
        }
    }

    // Adding a divisor line
    if (chart.select('#divisor-line').empty()) {
        const lineWidth = 1
        chart
            .append('line')
            .attr('id', 'divisor-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', height / 2 + (lineWidth / 2))
            .attr('y2', height / 2 + (lineWidth / 2))
            .attr('stroke', '#030712')
            .attr('stroke-width', lineWidth)
    }
}

function addLegend(chart, y, txt, colour) {
    chart
        .append('text')
        .attr('x', 32)
        .attr('y', y(txt === 'Women' ? 100 : -150))
        .attr('font-size', '2rem')
        .attr('fill', colour(txt))
        .attr('font-weight', 500)
        .attr('dominant-baseline', 'middle')
        .text(txt)
}