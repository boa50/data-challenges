export const getDateObject = (d, isFullDateField) =>
    isFullDateField ?
        new Date(`${d + 'T00:00:00'}`) :
        new Date(d, 0, 1, 0, 0, 0, 0)

export const getBeginingYearDate = year =>
    new Date(year, 0, 1, 0, 0, 0, 0).getTime()

export const getYearFromTime = time =>
    new Date(time).getFullYear()