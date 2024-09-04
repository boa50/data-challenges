import { addLegend, getTextWidth } from "../../node_modules/visual-components/index.js"

export const plotLegend = (chart, colours, margin) => {
    const legends = [
        'Land Use Change;;(changes in biomass from deforestation and in soil carbon)',
        'Farm;;(methane emissions from cow and rice; emissions from fertilizers, manure and farm machinery)',
        'Animal Feed;;(on-farm emissions from crop production and its processing into feed for livestock)',
        'Others;;(emissions from food processing, transporting, retailing and packaging)',
    ]

    for (let i = 0; i < legends.length; i++) {
        plotSingleLegend(chart, legends[i], colours[i], margin, -margin.top + (14 * (i + 1)))
    }
}

function plotSingleLegend(chart, text, colour, margin, yPosition) {
    const [title, explanation] = text.split(';;')

    addLegend({
        chart,
        legends: [title],
        colours: colour,
        xPosition: -margin.left,
        yPosition,
        fontSize: '0.5rem'
    })

    addLegend({
        chart,
        legends: [explanation],
        colours: colour,
        xPosition: -margin.left + getTextWidth(title, '0.5rem') + 4,
        yPosition,
        fontWeight: 300,
        fontSize: '0.45rem'
    })
}