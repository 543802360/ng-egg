import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxDataVService {
  private _title: string;

  public get title(): string {
    return this._title;
  }


  public set title(v: string) {
    this._title = v;
  }

  constructor() { }
}
