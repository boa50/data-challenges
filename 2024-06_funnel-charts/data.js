const inital = 100
const productionLoss = inital * 0.65
const production = inital - productionLoss
const transmissionLoss = inital * 0.02
const transmission = production - transmissionLoss
const distributionLoss = inital * 0.04
const distribution = transmission - distributionLoss
const homeLoss = distribution * 0.1
const home = distribution - homeLoss


export const data = [
    { step: 'Energy Source', value: inital },
    { step: 'Generated', value: production },
    { step: 'Transmitted', value: transmission },
    { step: 'Distributed', value: distribution },
    { step: 'Used by Houses', value: home },
]