import { getChart, appendChartContainer, getMargin } from "../node_modules/visual-components/index.js"
import { plot as plotStatic } from "./charts/static/script.js"
import { plot as plotDynamic } from "./charts/dynamic/script.js"

const getData = () =>
    Promise.all([
        d3.csv('data/dataset.csv')
            .then(d => d.map(v => { return { ...v, male: +v.male * -1, female: +v.female } })),
        d3.csv('data/dataset.csv')
            .then(d => {
                const long_data = []
                d.forEach(row => {
                    Object.keys(row).forEach(colname => {
                        if (colname !== 'year')
                            long_data.push({
                                'year': row['year'],
                                'group': colname,
                                'value': colname === 'male' ? -row[colname] : +row[colname]
                            })
                    })
                })

                return long_data
            })
    ])

const streamgraph = appendChartContainer({ idNum: 1, chartTitle: 'Olympics Gender Equality' })
const streamgraphDynamic = appendChartContainer({ idNum: 2, chartTitle: 'Olympics Gender Equality' })

getData().then(datasets => {
    const data = datasets[0]
    const dynamicData = datasets[1]
    const chartMargin = getMargin({ left: 64, bottom: 48, right: 40 })

    plotStatic(
        getChart({ id: streamgraph, margin: chartMargin }),
        data
    )

    plotDynamic(
        getChart({ id: streamgraphDynamic, margin: chartMargin }),
        dynamicData
    )
})
