export const addLabels = (chart, width, height, palette) => {
    addLabel(chart, width, height, palette.vermillion, 'top', 'Animal Based')
    addLabel(chart, width, height, palette.bluishGreen, 'bottom', 'Plant Based')
}

function addLabel(chart, width, height, colour, position, text) {
    chart
        .append('text')
        .attr('x', width / 1.05)
        .attr('y', position === 'top' ? height / 2 - 32 : height / 2 + 32)
        .attr('dominant-baseline', position === 'top' ? 'auto' : 'hanging')
        .attr('text-anchor', 'end')
        .attr('font-size', '2rem')
        .attr('font-weight', 500)
        .attr('fill', colour)
        .attr('opacity', 0.5)
        .text(text)
}