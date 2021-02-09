import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-group-suggestion',
  templateUrl: './group-suggestion.component.html',
  styles: [
  ]
})
export class GroupSuggestionComponent implements OnInit {


  _jtmc: string;
  autoChangeSub = new Subject<any>();
  dataSource: string[];



  public get jtmc(): string {
    return this._jtmc;
  }


  public set jtmc(v: string) {
    this._jtmc = v;
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
          return this.http.get('enterprise-group/suggestion', { jtmc: resp })
        }))
      .subscribe(resp => {

        this.dataSource = resp.data;

      });
  }

  setjtmc(e) {
    console.log('set jtmc:', e);
    this._jtmc = e;
  }

}
