import { createText } from "../../../node_modules/visual-components/index.js"

export const addAnnotation = ({
    chart,
    height,
    x,
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
        // .attr('fill', '#a3a3a3')
        .attr('fill', '#525252')
        // .attr('opacity', 0.5)
        .attr('opacity', 0.75)

    createText({
        svg: chart,
        x: xPos,
        y: marginTop,
        width: textWidth,
        height: 40,
        // textColour: '#525252',
        textColour: '#d4d4d4',
        fontSize,
        alignVertical: 'hanging',
        alignHorizontal: textAnchor,
        htmlText: txt
    })
}

export const addDataPoint = (chart, group, x, y, lastYearData, colour) => {
    const g = chart
        .append('g')
        .attr('id', `data-point-${group}`)
        .attr('transform', `translate(${[x('2024'), y(lastYearData[group])]})`)

    g
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 3)
        .attr('fill', colour(group))
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1)

    const percentValue = Math.abs(lastYearData[group]) / (lastYearData.female + Math.abs(lastYearData.male))

    g
        .append('text')
        .attr('x', 4)
        .attr('y', 0)
        .attr('fill', colour(group))
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '0.7rem')
        .text(`${d3.format('.1%')(percentValue)}`)
}