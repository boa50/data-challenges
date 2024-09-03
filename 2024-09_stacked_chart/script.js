import { appendChartContainer, getChart } from "../node_modules/visual-components/index.js"
import { addChart } from "./chart.js"

const chartId = appendChartContainer({ idNum: 0, chartTitle: 'Stacked' })

await new Promise(r => setTimeout(r, 1))

addChart(getChart({ id: chartId }))