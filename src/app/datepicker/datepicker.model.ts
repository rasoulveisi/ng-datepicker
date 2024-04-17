
export enum customCalendarType {
  today,
  thisWeek,
  thisMonth,
  lastMonth,
  lastThreeMonth,
  thisYear,
}

export enum CustomRangeDate {
  Between,
  Before,
  On,
  After,
}

export interface IConfig {
  [key: string]: string | number | boolean | Date | null;
  minDate: null | Date,
  maxDate: null | Date,
  startEndClass: string | null

}


export const DATE_RANGE_MENU: Array<{ value: customCalendarType; label: string }> = [
  { label: 'Today', value: customCalendarType.today },
  { label: 'This Week', value: customCalendarType.thisWeek },
  { label: 'This Month', value: customCalendarType.thisMonth },
  { label: 'Last Month', value: customCalendarType.lastMonth },
  { label: 'Last Three Month', value: customCalendarType.lastThreeMonth },
  { label: 'This Year', value: customCalendarType.thisYear },
];

export interface IDatepickerOutput {
  selectedDate?: { start: Date; end: Date } | null;
  isShowChange: boolean;
  selectedList: number | null;
}
