import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateRangePickerService {
  constructor(private datePipe: DatePipe) { }

  getSelectedDateText(selectDate: any) {
    if (selectDate.start === selectDate.end && selectDate.start !== null) {
      return `${this.datePipe.transform(selectDate.start, 'dd-MM-yy')}`;
    } else if (selectDate.start === null && selectDate.end === null) {
      return 'Filter by EDD';
    } else {
      return `${this.datePipe.transform(selectDate.start, 'dd-MM-yy') ?? ''} - ${this.datePipe.transform(selectDate.end, 'dd-MM-yy') ?? ''
        }`;
    }
  }

  isResetButtonVisible(
    selectedDate: Partial<{ start: string | Date; end: string | Date }>,
    defaultDate: Partial<{ start: string | Date; end: string | Date }>
  ): boolean {
    const _selectedDate = {
      start: selectedDate.start ? new Date(selectedDate.start).toDateString() : null,
      end: selectedDate.end ? new Date(selectedDate.end).toDateString() : null,
    };
    const _defaultDate = {
      start: defaultDate.start ? new Date(defaultDate.start).toDateString() : null,
      end: defaultDate.end ? new Date(defaultDate.end).toDateString() : null,
    };

    const selectedDateKeys = Object.keys(_selectedDate);
    const defaultDateKeys = Object.keys(_defaultDate);

    if (selectedDateKeys.length !== defaultDateKeys.length) {
      return true;
    }

    for (let key of selectedDateKeys) {
      if (_selectedDate[key as keyof typeof _selectedDate] !== _defaultDate[key as keyof typeof _defaultDate]) {
        return true;
      }
    }

    return false;
  }
}

