export const animateSingleLine = (path, transition) => {
    const pathLength = path.node().getTotalLength()

    path
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength)
        .transition(transition)
        .attr('stroke-dashoffset', 0)
}