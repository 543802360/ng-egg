import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-nsrmc-suggestion',
  templateUrl: './nsrmc-suggestion.component.html',
  styles: [
  ]
})
export class NsrmcSuggestionComponent implements OnInit {


  _nsrmc: string;
  autoChangeSub = new Subject<any>();
  dataSource: string[];



  public get nsrmc(): string {
    return this._nsrmc;
  }


  public set nsrmc(v: string) {
    this._nsrmc = v;
  }


  constructor(private http: _HttpClient) { }

  ngOnInit(): void {
    // 搜索提示自动完成框
    this.autoChangeSub
      .pipe(
        // filter(resp => {
        //   return resp && resp.length >= 2
        // }),
        debounceTime(400),
        switchMap(resp => {
          return this.http.get('nsr/suggestion', { NSRMC: resp })
        }))
      .subscribe(resp => {

        this.dataSource = resp.data;

      });
  }

  setNsrmc(e) {
    console.log('set nsrmc:', e);
    this._nsrmc = e;
  }

}
