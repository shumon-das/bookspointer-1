export const englishNumberToBengali = (englishNumber: number) => {
        const englishToBengaliMap = {
                '0': '০',
                '1': '১',
                '2': '২',
                '3': '৩',
                '4': '৪',
                '5': '৫',
                '6': '৬',
                '7': '৭',
                '8': '৮',
                '9': '৯'
        } as any;

    return englishNumber
        ? englishNumber.toString().replace(/\d/g, (digit) => englishToBengaliMap[digit])
        : '০';
}