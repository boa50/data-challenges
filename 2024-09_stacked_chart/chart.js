import { addAxis, colours } from '../node_modules/visual-components/index.js'
import { convertNumber, formatFoodName } from './utils.js'
import { addLabels } from './labels.js'

const animalBasedFoods = ['Beef (beef herd)', 'Lamb & Mutton', 'Cheese',
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
        .attr('x1', 0 - margin.left + 32)
        .attr('x2', width)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', d3.hsl(palette.axis).brighter(2))
        .attr('stroke-dasharray', '4 2')

    addLabels(chart, width, height, palette)

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
}

