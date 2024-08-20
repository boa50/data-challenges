import { getChart, appendChartContainer, addAxis, getMargin, updateXaxis, updateYaxis, createText } from "../node_modules/visual-components/index.js"
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
    const { chart, width, height } = getChart({ id: streamgraph, margin: getMargin({ left: 64, bottom: 48, right: 40 }) })

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

    // Adding specific points with annotations
    const addAnnotation = ({
        id = Math.random(),
        year,
        txt,
        position = 'right',
        fontSize = '0.7rem',
        marginTop = 4,
        textWidth = 150,
        x
    }) => {
        const rectWidth = 5

        let xPos, textAnchor
        switch (position) {
            case 'right':
                xPos = rectWidth / 2 + 4
                textAnchor = 'start'
                break;

            case 'left':
                xPos = -rectWidth / 2 - 4 - textWidth
                textAnchor = 'end'
                break;

            default:
                break;
        }

        const group = chart
            .append('g')
            .attr('id', id)
            .attr('transform', `translate(${[x(year), 0]})`)

        group
            .append('rect')
            .attr('x', -rectWidth / 2)
            .attr('y', 0)
            .attr('width', rectWidth)
            .attr('height', height)
            .attr('fill', '#a3a3a3')
            .attr('opacity', 0.5)

        createText({
            svg: group,
            x: xPos,
            y: marginTop,
            width: textWidth,
            height: 40,
            textColour: '#525252',
            fontSize,
            alignVertical: 'hanging',
            alignHorizontal: textAnchor,
            htmlText: txt
        })
    }

    const updateAnnotationPosition = (id, x, year) => {
        chart
            .select(`#${id}`)
            .attr('transform', `translate(${[x(year), 0]})`)
    }


    const lastYearData = data.filter(d => d.year === '2024')
    const lastYearValues = {
        female: lastYearData.filter(d => d.group === 'female')[0].value,
        male: lastYearData.filter(d => d.group === 'male')[0].value
    }

    // Adding end point data
    const addDataPoint = (group, x, y) => {
        const g = chart
            .append('g')
            .attr('id', `data-point-${group}`)
            .attr('transform', `translate(${[x(getBeginingYearDate(2024)), y(lastYearValues[group])]})`)

        g
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 3)
            .attr('fill', colour(group))
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', 1)

        const percentValue = Math.abs(lastYearValues[group]) / (lastYearValues.female + Math.abs(lastYearValues.male))

        g
            .append('text')
            .attr('x', 4)
            .attr('y', 0)
            .attr('fill', colour(group))
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '0.7rem')
            .text(`${d3.format('.1%')(percentValue)}`)
    }

    const updateDataPointPosition = (group, x, y) => {
        chart
            .select(`#data-point-${group}`)
            .attr('transform', `translate(${[x(getBeginingYearDate(2024)), y(lastYearValues[group])]})`)
    }

    const addCustomElements = (data, x, y) => {
        const lastYear = d3.max(data, d => d.date.getFullYear())

        const configureAnnotation = (dt, txt, textWidth) => {
            if (lastYear >= dt) {
                const id = `annotation-${dt}`
                const year = getBeginingYearDate(dt)

                if (chart.select(`#${id}`).empty()) {
                    addAnnotation({
                        id,
                        year,
                        txt,
                        x,
                        textWidth
                    })
                } else {
                    updateAnnotationPosition(id, x, year)
                }
            }
        }
        configureAnnotation(1996, 'Promoting women becomes a mission of the IOC')
        configureAnnotation(1964, 'Women represented 13% of the participants', 120)
        configureAnnotation(1900, 'First modern games featuring female athletes')

        if (lastYear >= 2016) {
            if (chart.select('#data-point-female').empty()) {
                addDataPoint('female', x, y)
                addDataPoint('male', x, y)
            } else {
                updateDataPointPosition('female', x, y)
                updateDataPointPosition('male', x, y)
            }
        }
    }

    animateArea({
        chart,
        data,
        yearField: 'year',
        x,
        y,
        updateAxis,
        areaAttrs: path => path
            .attr('fill', d => colour(d.key)),
        addCustom: (data, x, y) => addCustomElements(data, x, y)
    })


    // Adding legend directly on the chart
    const addLegend = txt => {
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

    addLegend('Women')
    addLegend('Men')

})