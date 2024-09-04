import { addAxis, colours } from '../node_modules/visual-components/index.js'

const animalBasedFoods = ['Beef (beef herd)', 'Lamb & Mutton', 'Cheese', //'Shrimps (farmed)',
    'Fish (farmed)', 'Pig Meat', 'Poultry Meat', 'Eggs', 'Milk',]
const plantBasedFoods = ['Dark Chocolate', 'Coffee', 'Palm Oil', 'Rice', 'Nuts', 'Tofu',
    'Oatmeal', 'Soy milk']
const includedFoods = [...animalBasedFoods, ...plantBasedFoods]

export const addChart = async (chartProps, theme = 'light') => {
    const { chart, width, height, margin } = chartProps
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
            .sort((a, b) => {
                const isAanimal = animalBasedFoods.includes(a.food)
                const isBanimal = animalBasedFoods.includes(b.food)

                if (isAanimal && !isBanimal) return -1
                else if (!isAanimal && isBanimal) return 1
                else return b.total - a.total
            })
            .map(d => { return { ...d, food: formatFoodName(d.food) } })
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
        .range([palette.vermillion, palette.bluishGreen, palette.amber, d3.hsl(palette.axis).brighter(1.5)])

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

    chart
        .append('line')
        .attr('x1', 0 - margin.left + 32)
        .attr('x2', width)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', d3.hsl(palette.axis).brighter(2))
        .attr('stroke-dasharray', '4 2')

    chart
        .append('text')
        .attr('x', width / 1.05)
        .attr('y', height / 2 - 32)
        .attr('dominant-baseline', 'auto')
        .attr('text-anchor', 'end')
        .attr('font-size', '2rem')
        .attr('font-weight', 500)
        .attr('fill', palette.vermillion)
        .attr('opacity', 0.5)
        .text('Animal Based')

    chart
        .append('text')
        .attr('x', width / 1.05)
        .attr('y', height / 2 + 32)
        .attr('dominant-baseline', 'hanging')
        .attr('text-anchor', 'end')
        .attr('font-size', '2rem')
        .attr('font-weight', 500)
        .attr('fill', palette.bluishGreen)
        .attr('opacity', 0.5)
        .text('Plant Based')

    addAxis({
        chart,
        width,
        height,
        colour: palette.axis,
        x,
        y,
        xLabel: 'CO₂-equivalents kg per food kg',
        yLabel: 'Food',
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

function formatFoodName(food) {
    switch (food) {
        case 'Beef (beef herd)':
            return 'Beef'
        case 'Lamb & Mutton':
            return 'Lamb'
        case 'Shrimps (farmed)':
            return 'Shrimp'
        case 'Fish (farmed)':
            return 'Fish'
        case 'Pig Meat':
            return 'Pig'
        case 'Poultry Meat':
            return 'Poultry'
        case 'Dark Chocolate':
            return 'Chocolate'
        default:
            return food
    }
}