import { getChart } from "../node_modules/visual-components/index.js"
import { palette } from "../colours.js"

const inital = 100
const productionLoss = inital * 0.65
const production = inital - productionLoss
const transmissionLoss = inital * 0.02
const transmission = production - transmissionLoss
const distributionLoss = inital * 0.04
const distribution = transmission - distributionLoss
const homeLoss = distribution * 0.1
const home = distribution - homeLoss


const data = [
    { step: 'Energy Source', value: inital },
    { step: 'production', value: production },
    { step: 'transmission', value: transmission },
    { step: 'distribution', value: distribution },
    { step: 'home', value: home },
]

const { chart, width, height } = getChart({ id: 'chart1' })

const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, width])

const y = d3
    .scaleBand()
    .domain(data.map(d => d.step))
    .range([0, height])
    .padding(.2)

chart
    .selectAll('.data-point')
    .data(data)
    .join('rect')
    .attr('x', d => x(50 - (d.value / 2)))
    .attr('y', d => y(d.step))
    .attr('width', d => x(d.value))
    .attr('height', y.bandwidth())
    .attr('fill', d3.hsl(palette.orange).darker(0.5))

const getLinkPath = (d, i) => {
    if (data[i + 1] !== undefined) {
        return `
        M ${x(50 - (d.value / 2))} ${y(d.step) + y.bandwidth()} 
        H ${x(50 + (d.value / 2))} 
        L ${x(50 + (data[i + 1].value / 2))} ${y(data[i + 1].step)} 
        H ${x(50 - (data[i + 1].value / 2))} Z
        `
    }
}

chart
    .selectAll('.link-points')
    .data(data.slice(0, -1))
    .join('path')
    .attr('fill', d3.hsl(palette.orange + '70').brighter(0.1))
    .attr('d', (d, i) => getLinkPath(d, i))