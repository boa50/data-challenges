import { k, n } from "./constants.js"

const getDateObject = (d, isFullDateField) =>
    isFullDateField ?
        new Date(`${d + 'T00:00:00'}`) :
        new Date(d, 0, 1, 0, 0, 0, 0)

// const getDateObject = (d, dateField, yearField) =>
//     dateField !== undefined ?
//         new Date(`${d[dateField] + 'T00:00:00'}`) :
//         yearField !== undefined ?
//             new Date(d[yearField], 0, 1, 0, 0, 0, 0) :
//             new Date()

export const prepareLineData = (data, dateField, yearField, isRankedData) => {
    const groups = new Set(data.map(d => d.group))
    const isFullDateField = dateField !== undefined
    const timeField = isFullDateField ? dateField : yearField

    const dateValues = Array.from(d3.rollup(data, ([d]) => +d.value, d => d[timeField], d => d.group))
        .map(([date, data]) => [getDateObject(date, isFullDateField), data])
        .sort(([a], [b]) => d3.ascending(a, b))


    const rank = getValue => {
        const data = Array.from(groups, group => ({ group: group, value: getValue(group) }))
        if (isRankedData) data.sort((a, b) => d3.descending(a.value, b.value))
        for (let i = 0; i < data.length; i++) data[i].rank = Math.min(n, i)

        return data
    }

    const getKeyframes = () => {
        const keyframes = []
        let ka, a, kb, b

        for ([[ka, a], [kb, b]] of d3.pairs(dateValues)) {
            for (let i = 0; i < k; i++) {
                const t = i / k
                keyframes.push([
                    new Date(ka * (1 - t) + kb * t),
                    rank(group => (a.get(group) || 0) * (1 - t) + (b.get(group) || 0) * t)
                ])
            }
        }

        keyframes.push([new Date(kb), rank(group => b.get(group) || 0)])
        return keyframes
    }

    const keyframes = getKeyframes()

    const groupframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.group)
    const prev = new Map(groupframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
    const next = new Map(groupframes.flatMap(([, data]) => d3.pairs(data)))

    return { keyframes, prev, next }
}

export const prepareLineData0 = (data, dateField, yearField, values) => {
    const getDateObject = d =>
        dateField !== undefined ?
            new Date(`${d[dateField] + 'T00:00:00'}`) :
            yearField !== undefined ?
                new Date(d[yearField], 0, 1, 0, 0, 0, 0) :
                new Date()

    const getObjectValues = d => {
        const obj = {}
        values.forEach(field => {
            obj[field] = d[field]
        })

        return obj
    }

    return Array.from(data)
        .map(d => ({ 'date': getDateObject(d), ...getObjectValues(d) }))
        .sort((a, b) => d3.ascending(a.date, b.date))
}

export const prepareBarData = data => {
    const names = new Set(data.map(d => d.name))

    const dateValues = Array.from(d3.rollup(data, ([d]) => +d.value, d => d.date, d => d.name))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b))

    const rank = getValue => {
        const data = Array.from(names, name => ({ name, value: getValue(name) }))
        data.sort((a, b) => d3.descending(a.value, b.value))
        for (let i = 0; i < data.length; i++) data[i].rank = Math.min(n, i)

        return data
    }

    const getKeyframes = () => {
        const keyframes = []
        let ka, a, kb, b

        for ([[ka, a], [kb, b]] of d3.pairs(dateValues)) {
            for (let i = 0; i < k; i++) {
                const t = i / k
                keyframes.push([
                    new Date(ka * (1 - t) + kb * t),
                    rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
                ])
            }
        }

        keyframes.push([new Date(kb), rank(name => b.get(name) || 0)])
        return keyframes
    }

    const keyframes = getKeyframes()

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))

    return { keyframes, prev, next }
}