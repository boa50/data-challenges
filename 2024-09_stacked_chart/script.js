import { appendChartContainer, getChart, getMargin } from "../node_modules/visual-components/index.js"
import { addChart } from "./chart.js"

const chartId = appendChartContainer({
    idNum: 0,
    chartTitle: 'Look out for what you are eating!',
    chartSubtitle: 'Animal-based foods represent a considerable portion of CO₂ emissions in our diet. Some foods emit <strong>10-50</strong> times more CO₂ than a plant-based counterpart.',
    titleSize: 'text-3xl',
    subtitleSize: 'text-base'
})

await new Promise(r => setTimeout(r, 1))

addChart(getChart({ id: chartId, margin: getMargin({ left: 80, bottom: 38, top: 60 }) }))