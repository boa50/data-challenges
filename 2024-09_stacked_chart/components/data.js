import { convertNumber, formatFoodName } from './utils.js'

const animalBasedFoods = ['Beef (beef herd)', 'Lamb & Mutton', 'Cheese',
    'Fish (farmed)', 'Pig Meat', 'Poultry Meat', 'Eggs', 'Milk',]
const plantBasedFoods = ['Dark Chocolate', 'Coffee', 'Palm Oil', 'Rice', 'Nuts', 'Tofu',
    'Oatmeal', 'Soy milk']
const includedFoods = [...animalBasedFoods, ...plantBasedFoods]

export const prepareData = async () =>
    await d3.csv('data/dataset.csv')
        .then(data => data
            .filter(d => includedFoods.includes(d.food))
            .map(d => {
                return {
                    ...d,
                    landUse: convertNumber(d.landUse),
                    farm: convertNumber(d.farm),
                    animalFeed: convertNumber(d.animalFeed),
                    others: convertNumber(d.others)
                }
            })
            .map(d => { return { ...d, total: d.landUse + d.farm + d.animalFeed + d.others } })
            .sort((a, b) => {
                const isAanimal = animalBasedFoods.includes(a.food)
                const isBanimal = animalBasedFoods.includes(b.food)

                if (isAanimal && !isBanimal) return -1
                else if (!isAanimal && isBanimal) return 1
                else return b.total - a.total
            })
            .map(d => { return { ...d, food: formatFoodName(d.food) } })
        )