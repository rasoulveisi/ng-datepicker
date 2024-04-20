import { NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CustomRangeDate, DATE_RANGE_MENU, IConfig, IDatepickerOutput, customCalendarType } from './datepicker.model';
import { TabViewModule } from 'primeng/tabview';


@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CalendarModule, FormsModule, NgClass, TabViewModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  // encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent {
  private primeNgConfig = inject(PrimeNGConfig);
  private element = inject(ElementRef);
  // private translateService = inject(TranslateService);

  @HostListener('window:click', ['$event'])
  private documentClick(event: any): void {
    if (!this.isShow || !this.config['closeOnBackdrop']) {
      return;
    }
    const clickedInModal = this.element.nativeElement.contains(event.target);

    if (!clickedInModal && !this.isMonthOrYearChanged) {
      this.datepickerOutput = {
        selectedDate: null,
        isShowChange: false,
        selectedList: null,
      };
      this.onDatepickerChange.emit(this.datepickerOutput);
    }
    this.isMonthOrYearChanged = false;
  }

  @Output() onDatepickerChange: EventEmitter<IDatepickerOutput> = new EventEmitter<IDatepickerOutput>();

  @Input() config: IConfig = {
    startEndClass: 'range-custom',
    isTabShow: true,
    isListItemShow: true,
    isInputShow: false,
    showButtonBar: false,
    closeOnBackdrop: true,
    updateOnSelect: false,
    minDate: null,
    maxDate: null,
    lang: 'nl'
  };

  @Input() set defaultDate(value: { start: Date; end: Date }) {
    this.onSetDefaultDate(value);
  }

  @Input('range-date') set selectDate(value: { start: Date; end: Date }) {
    this.onSetSelectDate(value);
    if (value.start === null) this.tabIndex = CustomRangeDate.Before;
    if (value.end === null) this.tabIndex = CustomRangeDate.After;
    if (value.end === value.start) this.tabIndex = CustomRangeDate.On;
    this.onChangeTab(this.tabIndex);
  }

  @Input() selectedType: customCalendarType | null = null;

  isShow = true;
  tabEvent: any;
  tabIndex = 0;
  selectedMode: "single" | "multiple" | "range" | undefined = "range";
  customRangeDate = CustomRangeDate;
  startDate: string = '';
  endDate: string = '';
  dateRangeModel!: Date[];
  dateRange: (Date | null)[] = [new Date(), new Date()];
  selectedDate!: { start: string | null; end: string | null };
  selectedDatePicker!: { start: string | null; end: string | null };
  defaultDateValue: { start: Date; end: Date } | null = null;
  listSelectDates = DATE_RANGE_MENU;
  isMonthOrYearChanged = false;
  datepickerOutput!: IDatepickerOutput;

  ngAfterViewInit() {
    this.setInitConfig();
    this.setLanguage();
  }

  setLanguage() {
    // this.translateService.setDefaultLang(this.config.lang as string);
    // this.translateService.use(this.config.lang as string);
    // this.translateService.get('primeng').subscribe(res => this.primeNgConfig.setTranslation(res));
  }

  onChangeTab(index: number) {
    this.tabIndex = index ?? 0;
    const date = new Date(this.dateRangeModel[0]);
    switch (this.tabIndex) {
      case CustomRangeDate.Between:
        this.selectedMode = 'range';
        this.dateRange = this.dateRangeModel?.length
          ? [this.dateRangeModel[0], this.dateRangeModel[1]]
          : [null, null];
        break;
      case CustomRangeDate.Before:
        this.selectedMode = 'single';
        date.setDate(date.getDate());
        this.setDeliveryDateRangeModel();
        this.dateRange = [null, date];
        break;
      case CustomRangeDate.On:
        this.selectedMode = 'single';
        this.setDeliveryDateRangeModel();
        this.dateRange = [this.dateRangeModel[0], this.dateRangeModel[0]];
        break;
      case CustomRangeDate.After:
        this.selectedMode = 'single';
        date.setDate(date.getDate());
        this.setDeliveryDateRangeModel();
        this.dateRange = [date, null];
        break;
    }
  }

  private setDeliveryDateRangeModel() {
    if (Object.keys(this.dateRangeModel)?.length > 1) {

      this.dateRangeModel = [this.dateRangeModel[0] ?? this.dateRangeModel[1]];
    }
  }


  selectRangeDateCustom(type: customCalendarType, event: Event) {
    event.stopPropagation();
    this.selectedType = type;
    const date = new Date();
    const today = new Date();
    switch (type) {
      case customCalendarType.today:
        this.dateRange = [today, today];
        break;
      case customCalendarType.thisWeek:
        const weekDay = date.getDay();
        if (weekDay === 0) {
          date.setDate(date.getDate() - 6);
        } else if (weekDay >= 1) {
          date.setDate(date.getDate() - date.getDay() + 1);
        }
        this.dateRange = [date, new Date()];
        break;
      case customCalendarType.thisMonth:
        this.dateRange = [new Date(date.getFullYear(), date.getMonth(), 1), new Date()];
        break;
      case customCalendarType.lastMonth:
        this.dateRange = [
          new Date(date.getFullYear(), date.getMonth() - 1, 1),
          new Date(date.getFullYear(), date.getMonth(), 0),
        ];
        break;
      case customCalendarType.lastThreeMonth:
        let last3Month = new Date(date.getFullYear(), date.getMonth() - 3, 1);
        let monthOfLast = last3Month.getMonth() + 2;
        let last2Month = new Date(
          date.getFullYear(),
          monthOfLast,
          new Date(date.getFullYear(), monthOfLast, 0).getDate()
        );
        this.dateRange = [last3Month, last2Month];
        break;
      case customCalendarType.thisYear:
        this.dateRange = [new Date(date.getFullYear(), 0, 1), new Date()];
        break;
    }
    this.dateRangeModel = this.dateRange as Date[];
    this.onChangeTab(type === customCalendarType.today ? CustomRangeDate.On : 0);
  }

  confirm(): void {
    this.onChangeTab(this.tabIndex);
    this.datepickerOutput = {
      selectedDate: { start: (this.dateRange as Date[])[0], end: (this.dateRange as Date[])[1] },
      isShowChange: false,
      selectedList: this.selectedType,
    };
    this.onDatepickerChange.emit(this.datepickerOutput);
  }

  cancel() {
    this.datepickerOutput = {
      selectedDate: this.defaultDateValue,
      isShowChange: false,
      selectedList: null,
    };
    this.onDatepickerChange.emit(this.datepickerOutput);
  }

  reset(): void {
    this.dateRange = [new Date(), new Date()];
    this.datepickerOutput = {
      selectedDate: this.defaultDateValue,
      isShowChange: false,
      selectedList: null,
    };
    this.onDatepickerChange.emit(this.datepickerOutput);
  }

  changeCalendar() {
    this.selectedType = null;
    if (this.config['updateOnSelect'] && this.isMonthOrYearChanged) {
      this.onChangeTab(this.tabIndex);
      this.datepickerOutput = {
        selectedDate: { start: (this.dateRange as Date[])[0], end: (this.dateRange as Date[])[1] },
        isShowChange: true,
        selectedList: null,
      };
      this.onDatepickerChange.emit(this.datepickerOutput);
    }
  }

  onSetSelectDate(value: any) {
    const start = value?.start ? new Date(value.start) : null;
    const end = value?.end ? new Date(value.end) : null;

    if (start && end) {
      this.dateRange = [start, end];
      this.dateRangeModel = this.dateRange as Date[];
    } else if (start && !end) {
      this.dateRangeModel = [start];
    } else if (!start && end) {
      this.dateRangeModel = [end];
    } else {
      this.dateRangeModel = [new Date()];
    }
  }

  onSetDefaultDate(value: { start: Date; end: Date }) {
    this.defaultDateValue = value;

    if (!this.dateRange) {
      this.dateRange = [];
    }

    if (value.start) {
      this.dateRange[0] = value.start;
    }

    if (value.end) {
      this.dateRange[1] = value.end;
    }

    this.dateRangeModel = this.dateRange as Date[];
    this.onChangeTab(this.tabIndex);
  }

  completeInput() {
    this.selectedDate.start = this.startDate ? this.startDate.split('-').reverse().join('-') : null;
    this.selectedDate.end = this.endDate ? this.endDate.split('-').reverse().join('-') : null;

    this.selectedDatePicker.start = this.selectedDate.start
      ? this.selectedDate.start
      : this.selectedDate.end
        ? this.selectedDate.end
        : null;

    this.selectedDatePicker.end = this.selectedDate.end
      ? this.selectedDate.end
      : this.selectedDate.start
        ? this.selectedDate.start
        : null;

    this.selectedDatePicker = { ...this.selectedDatePicker };
    this.onSetSelectDate(this.selectedDatePicker);
    this.changeCalendar();
  }

  setInitConfig() {
    this.config = {
      startEndClass: this.config['startEndClass'] ?? 'range-custom',
      isTabShow: this.config['isTabShow'] ?? true,
      isListItemShow: this.config['isListItemShow'] ?? true,
      isInputShow: this.config['isInputShow'] ?? false,
      showButtonBar: this.config['showButtonBar'] ?? false,
      closeOnBackdrop: this.config['closeOnBackdrop'] ?? true,
      minDate: this.config['minDate'] ?? null,
      maxDate: this.config['maxDate'] ?? null,
      updateOnSelect: this.config['updateOnSelect'] ?? false,
      lang: this.config['lang'] ?? 'nl',
    };
  }
  onChangeMonthOrYear() {
    this.isMonthOrYearChanged = true;
  }

}
