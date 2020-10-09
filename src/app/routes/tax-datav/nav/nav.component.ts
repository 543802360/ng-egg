import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { TaxDataVService } from './../tax-data-v.service';

@Component({
  selector: 'app-tax-datav-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class TaxDatavNavComponent implements OnInit {
  taxSubjectVisible;
  selectSubject = "1";

  dataDesc = '';
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public taxDataVSrv: TaxDataVService

  ) {

  }

  ngOnInit() {
    // let date=new Date();
    // date.getFullYear();
    // date.getMonth();
  }

  dlgOk() {
    this.taxSubjectVisible = false;
    switch (this.selectSubject) {
      case "1": // 税收总体概况
        this.router.navigate(["./summary"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = "烟台市税收一张图";
        break;
      case "2":
        this.router.navigate(["./gsqy"], { relativeTo: this.activeRoute });
        setTimeout(() => {
          this.taxDataVSrv.title = "规上企业分布图";
        });
        break;
      case "3":
        this.router.navigate(["./yqjj"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = ''
        break;
      default:
        break;
    }
  }
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


