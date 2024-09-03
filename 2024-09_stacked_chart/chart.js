import { addAxis, colours } from "../node_modules/visual-components/index.js"

const includedFoods = ["Beef (beef herd)", "Lamb & Mutton", "Dark Chocolate",
    "Cheese", "Shrimps (farmed)", "Coffee", "Fish (farmed)", "Pig Meat", "Palm Oil",
    "Eggs", "Rice", "Nuts", "Milk", "Tofu", "Oatmeal", "Cassava", "Soy milk", "Bananas"]

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg
    const data = await d3.csv('data/dataset.csv')
        .then(data => data
            .filter(d => includedFoods.includes(d.food))
            .map(d => {
                return {
                    ...d,
                    landUse: convertNumber(d.landUse),
                    farm: convertNumber(d.farm),
                    animalFeed: convertNumber(d.animalFeed),
                    others: convertNumber(d.others)
                }
            })
            .map(d => { return { ...d, total: d.landUse + d.farm + d.animalFeed + d.others } })
            .sort((a, b) => b.total - a.total)
        )

    const subgroups = ['landUse', 'farm', 'animalFeed', 'others']

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.total) * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(data.map(d => d.food))
        .range([0, height])
        .padding(.1)

    const colour = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([palette.vermillion, palette.blue, palette.amber, palette.bluishGreen])

    const stackedData = d3
        .stack()
        .keys(subgroups)
        (data)

    chart
        .append('g')
        .selectAll('g')
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join('g')
        .attr('fill', d => colour(d.key))
        .attr('stroke', 'white')
        .selectAll('rect')
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join('rect')
        .attr('y', d => y(d.data.food))
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth())

    console.log(data.map(d => d.food));


    addAxis({
        chart,
        width,
        height,
        colour: palette.axis,
        x,
        y,
        hideXdomain: true,
        hideYdomain: true
    })

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

function convertNumber(number) {
    return +number > 0 ? +number : 0
}