export const convertNumber = number => +number > 0 ? +number : 0

export const formatFoodName = food => {
    switch (food) {
        case 'Beef (beef herd)':
            return 'Beef'
        case 'Lamb & Mutton':
            return 'Lamb'
        case 'Shrimps (farmed)':
            return 'Shrimp'
        case 'Fish (farmed)':
            return 'Fish'
        case 'Pig Meat':
            return 'Pig'
        case 'Poultry Meat':
            return 'Poultry'
        case 'Dark Chocolate':
            return 'Chocolate'
        default:
            return food
    }
}