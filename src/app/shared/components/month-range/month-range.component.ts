import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-month-range',
  templateUrl: './month-range.component.html',
  styles: [
  ]
})
export class MonthRangeComponent implements OnInit {

  _date_range: Date[] = [];
  _startDate: Date;
  _endDate: Date;

  constructor() {
    const date = new Date();
    this._startDate = new Date(date.getFullYear(), 0);
    this._endDate = date;

  }

  ngOnInit(): void {
  }


  public get startDate(): Date {
    return this._startDate
  }

  public get endDate(): Date {
    return this._endDate
  }

  public get date_range(): Date {
    return this.date_range
  }



}
