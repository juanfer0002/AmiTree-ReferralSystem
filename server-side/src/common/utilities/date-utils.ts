
export interface IDateRange { start: Date; end: Date; }
export interface ITimestampRange { start: number; end: number; }

export class DateUtils {

    public static getCurrentDateWithoutTime() {
        return DateUtils.removeTimeFromDate(Date.now());
    }

    public static removeTimeFromDate(date: Date | number) {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

}
