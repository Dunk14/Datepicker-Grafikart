import moment from 'moment'

export default class Month {
    /**
     * Defines limits of a month, its number for month and year
     * @param month = [month number]
     * @param year = [year number]
     */
    constructor(month, year) {
        let instance = moment([year, month]);
        this.start = instance.startOf('month')
        this.end = moment(this.start).endOf('month')
        this.month = this.start.month()
        this.year = this.start.year()
    }

    getWeekStart () {
        return this.start.weekday()
    }

    getDays () {
        let dayIterator = moment(this.start)
        let daysArray = []
        for (let i = 0; i < this.end.daysInMonth(); i++) {
            daysArray.push(moment(dayIterator))
            dayIterator.add(1, 'days')
        }
        return daysArray
    }

    getFormatted () {
        return this.start.format('MMMM YYYY');
    }
}