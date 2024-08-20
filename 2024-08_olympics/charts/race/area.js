export const createAreaChart = (chart, x, y, areaAttrs) => {
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

export const updateAreaChart = (updateArea, stackedData, updateAxis, x, y) => {
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