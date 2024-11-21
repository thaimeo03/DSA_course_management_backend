export class FormatUtil {
    /**
     * Format money with the locale 'vi-VN' and currency 'VND'
     * @param amount the amount of money to be formatted
     * @returns a string representing the formatted money
     */
    static formatMoney(amount: number) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }

    /**
     * Format date with the locale 'vi-VN'
     * @param date the date to be formatted
     * @returns a string representing the formatted date in the format 'dd/MM/yyyy'
     */
    static formatDate(date: Date) {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
}
