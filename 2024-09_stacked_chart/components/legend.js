import { addLegend, getTextWidth } from "../../node_modules/visual-components/index.js"

export const plotLegend = (chart, colours, margin) => {
    const legends = [
        'Land Use Change;;(changes in biomass from deforestation and in soil carbon)',
        'Farm;;(methane emissions from cow and rice; emissions from fertilizers, manure and farm machinery)',
        'Animal Feed;;(on-farm emissions from crop production and its processing into feed for livestock)',
        'Others;;(emissions from food processing, transporting, retailing and packaging)',
    ]

    for (let i = 0; i < legends.length; i++) {
        const xPosition = getTextWidth(legends[i - 1], '0.45rem') * (i % 2)

        plotSingleLegend(
            chart,
            legends[i],
            colours[i],
            margin,
            -margin.top + (14 * (Math.floor(i / 2) + 1)),
            xPosition > 0 ? xPosition : undefined
        )
    }
}

function plotSingleLegend(chart, text, colour, margin, yPosition, xPosition) {
    const [title, explanation] = text.split(';;')
    xPosition = xPosition === undefined ? -margin.left : xPosition - margin.left
    const subtitleXposition = xPosition + getTextWidth(title, '0.5rem') + 4

    addLegend({
        chart,
        legends: [title],
        colours: colour,
        xPosition,
        yPosition,
        fontSize: '0.5rem'
    })

    addLegend({
        chart,
        legends: [explanation],
        colours: colour,
        xPosition: subtitleXposition,
        yPosition,
        fontWeight: 300,
        fontSize: '0.45rem'
    })
}