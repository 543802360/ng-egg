import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-tax-datav-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class TaxDatavNavComponent implements OnInit {
  taxSubjectVisible;
  selectSubject = "3";
  dataDesc = '统计数据截止到2020年2月17日';
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    // let date=new Date();
    // date.getFullYear();
    // date.getMonth();
  }

  /**
   * 土地使用税风险
   */
  tdRisk() {
    this.router.navigate(["./risk"], { relativeTo: this.activeRoute });
  }
  /**
   * 税收总体概况
   */
  taxSummary() { }
  dlgCancel() {
    this.taxSubjectVisible = false;
  }
  nav(flag) {
    switch (flag) {
      case "1": // 税收总体概况
        this.router.navigate(["./ssfx"], { relativeTo: this.activeRoute });
        break;
      case "2":
        this.router.navigate(["./qyjt"], { relativeTo: this.activeRoute });
        setTimeout(() => {
        });
        break;
      case "3":
        this.router.navigate(["./yqjj"], { relativeTo: this.activeRoute });
        break;
      default:
        break;
    }
  }
}


