export const addChart = async (chartProps) => {
    const { chart, width, height } = chartProps
    const data = await d3.csv('data/dataset.csv')
        .then(data => data.map(d => {
            return {
                ...d,
                landUse: +d.landUse,
                farm: +d.farm,
                animalFeed: +d.animalFeed,
                others: +d.others
            }
        }))


    // const x = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, d => d.X_VARIABLE).map((d, i) => d * [0.95, 1.05][i]))
    //     .range([0, width])

    // const y = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, d => d.Y_VARIABLE).map((d, i) => d * [0.95, 1.05][i]))
    //     .range([height, 0])

    // const x = d3
    //     .scaleLinear()
    //     .domain([0, MAX_VALUE])
    //     .range([0, width])

    // const y = d3
    //     .scaleBand()
    //     .domain(data.map(d => d.GROUP_FIELD))
    //     .range([0, height])
    //     .padding(.1)

    // chart
    //     .selectAll('.myRect')
    //     .data(data)
    //     .join('rect')
    //     .attr('x', x(0))
    //     .attr('y', d => y(d.GROUP_FIELD))
    //     .attr('width', d => x(d.VALUE))
    //     .attr('height', y.bandwidth())
    //     .attr('fill', '#69b3a2')
}