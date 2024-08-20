import { getChart, appendChartContainer, addAxis, getMargin, createText } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

const getData = () =>
    d3.csv('data/dataset.csv')
        .then(d => d.map(v => { return { ...v, male: +v.male * -1, female: +v.female } }))

const streamgraph = appendChartContainer({ idNum: 1, chartTitle: 'Diverging chart' })

getData().then(data => {
    const { chart, width, height } = getChart({ id: streamgraph, margin: getMargin({ left: 64, bottom: 48 }) })

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

    // Adding specific points with annotations
    const addAnnotation = ({
        year,
        txt,
        position = 'right',
        fontSize = '0.7rem',
        marginTop = 4,
        textWidth = 150
    }) => {
        const rectWidth = 5

        let xPos, textAnchor
        switch (position) {
            case 'right':
                xPos = x(year) + rectWidth / 2 + 4
                textAnchor = 'start'
                break;

            case 'left':
                xPos = x(year) - rectWidth / 2 - 4 - textWidth
                textAnchor = 'end'
                break;

            default:
                break;
        }

        chart
            .append('rect')
            .attr('x', x(year) - rectWidth / 2)
            .attr('y', 0)
            .attr('width', rectWidth)
            .attr('height', height)
            .attr('fill', '#a3a3a3')
            .attr('opacity', 0.5)

        createText({
            svg: chart,
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
    addAnnotation({
        year: '1900',
        txt: 'First modern games featuring female athletes'
    })
    addAnnotation({
        year: '1964',
        txt: 'Women represented 13% of the participants',
        textWidth: 120
    })
    addAnnotation({
        year: '1996',
        txt: 'Promoting women becomes a mission of the IOC'
    })

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
