import { updateXaxis, updateYaxis, getBeginingYearDate, getYearFromTime } from "../../../node_modules/visual-components/index.js"

export const updateAxis = (stackedData, chart, x, y, xFormat, yFormat) => {
    const maxValue = d3.max(d3.union(...stackedData.map(d => d.map(v => d3.max(v, v2 => Math.abs(v2))))), d => d)
    y.domain([-maxValue, maxValue].map(d => d * 1.05))

    const xTickYears = [1900, 1920, 1940, 1960, 1980, 2000, 2020]
    const xTickValues = xTickYears.map(d => getBeginingYearDate(d))
    const lastYear = getYearFromTime(x.domain()[1])
    const yearToInclude = lastYear - (lastYear % 4)

    if (lastYear >= 1980 &&
        !xTickYears.includes(yearToInclude - 4) &&
        !xTickYears.includes(yearToInclude) &&
        !xTickYears.includes(yearToInclude + 4)) {

        xTickValues.push(getBeginingYearDate(yearToInclude))
    } else if (lastYear < 1980 && !xTickYears.includes(yearToInclude)) {

        xTickValues.push(getBeginingYearDate(yearToInclude))
    }

    updateXaxis({
        chart,
        x,
        format: xFormat,
        hideDomain: true,
        transitionFix: false,
        tickValues: xTickValues
    })

    updateYaxis({
        chart,
        y,
        format: yFormat,
        hideDomain: true,
        transitionFix: false,
    })
}