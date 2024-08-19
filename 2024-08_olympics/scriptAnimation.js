import { getChart, appendChartContainer, addAxis, getMargin, updateXaxis, updateYaxis } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"
import { animateMultipleLines } from "./animation/line.js"
import { animateArea } from "./animation/area.js"

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
                            'value': colname === 'male' ? -row[colname] : +row[colname]
                        })
                })
            })

            return long_data
        })

const streamgraph = appendChartContainer({ idNum: 2, chartTitle: 'Diverging chart - Animated' })

getData().then(data => {
    const { chart, width, height } = getChart({ id: streamgraph, margin: getMargin({ left: 64 }) })

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
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Number of Athletes',
        xFormat,
        yFormat,
        hideXdomain: true,
        hideYdomain: true,
    })

    const getBeginingYearDate = year =>
        new Date(year, 0, 1, 0, 0, 0, 0).getTime()

    const getYearFromTime = time =>
        new Date(time).getFullYear()

    const updateAxis = stackedData => {
        // const maxValue = d3.max(keyframe, d => Math.abs(d.value))
        // y.domain([-maxValue, maxValue].map(d => d * 1.05))
        const maxValue = d3.max(d3.union(...stackedData.map(d => d.map(v => d3.max(v, v2 => Math.abs(v2))))), d => d)
        y.domain([-maxValue, maxValue].map(d => d * 1.05))

        const xTickYears = [1900, 1920, 1940, 1960, 1980, 2000, 2020]
        const xTickValues = xTickYears.map(d => getBeginingYearDate(d))
        const lastYear = getYearFromTime(x.domain()[1])
        const yearToInclude = lastYear - (lastYear % 4)

        if (lastYear >= 1980 &&
            !xTickYears.includes(yearToInclude - 4) &&
            !xTickYears.includes(yearToInclude) &&
            !xTickYears.includes(yearToInclude + 4)) {

            xTickValues.push(getBeginingYearDate(yearToInclude))
        } else if (lastYear < 1980 && !xTickYears.includes(yearToInclude)) {

            xTickValues.push(getBeginingYearDate(yearToInclude))
        }


        updateXaxis({
            chart,
            x,
            format: xFormat,
            hideDomain: true,
            transitionFix: false,
            tickValues: xTickValues
        })

        updateYaxis({
            chart,
            y,
            format: yFormat,
            hideDomain: true,
            transitionFix: false,
        })
    }

    // animateMultipleLines({
    //     chart,
    //     data,
    //     yearField: 'year',
    //     x,
    //     y,
    //     updateAxis,
    //     lineAttrs: path => path
    //         .attr('stroke', d => colour(d[0]))
    //         .attr('stroke-width', 1)
    // })

    animateArea({
        chart,
        data,
        yearField: 'year',
        x,
        y,
        updateAxis,
        areaAttrs: path => path
            .attr('fill', d => colour(d.key))
    })


    // Adding legend directly on the chart
    const addLegend = txt => {
        chart
            .append('text')
            .attr('x', 16)
            .attr('y', y(txt === 'Women' ? 150 : -200))
            .attr('font-size', '2rem')
            .attr('fill', colour(txt))
            .attr('font-weight', 500)
            .attr('dominant-baseline', 'middle')
            .text(txt)
    }

    addLegend('Women')
    addLegend('Men')

})