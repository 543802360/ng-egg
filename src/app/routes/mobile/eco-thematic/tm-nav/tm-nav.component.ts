import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from "@angular/router"
import { ToastService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'app-mobile-tm-nav',
  templateUrl: './tm-nav.component.html',
  styleUrls: ['./tm-nav.component.less']
})
export class MobileTmNavComponent implements OnInit {
  title;
  constructor(private http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastSrv: ToastService) { }

  ngOnInit() { }
  //专题切换
  nav(e) {
    switch (e.innerText) {
      // case '分税种分析':

      //     break;
      case '大企业税收':
        this.router.navigate(['./big-enterprise'], { relativeTo: this.route })
        this.title = '大企业税收';
        break;
      case '企业税收排名':
        this.router.navigate(['./order'], { relativeTo: this.route })
        this.title = '企业税收排名';
        break;
      case '企业税收明细':
        this.router.navigate(['./single'], { relativeTo: this.route })
        this.title = '企业税收明细';
        break;

      default:
        break;
    }
  }
}
