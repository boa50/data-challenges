export const plotGraph = (chart, data, subgroups, x, y, colour, width, height, margin, palette) => {
    const stackedData = d3
        .stack()
        .keys(subgroups)
        (data)

    chart
        .append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => colour(d.key))
        .attr('stroke', 'white')
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('y', d => y(d.data.food))
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth())

    chart
        .append('line')
        .attr('x1', 0 - margin.left + 28)
        .attr('x2', width)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', d3.hsl(palette.axis).brighter(2))
        .attr('stroke-dasharray', '4 2')
}