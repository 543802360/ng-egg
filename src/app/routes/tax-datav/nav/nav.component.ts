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
        this.taxDataVSrv.title = "税收数据空间可视化分析平台";
        break;
      case "2":
        this.router.navigate(["./gsqy"], { relativeTo: this.activeRoute });
        setTimeout(() => {
          this.taxDataVSrv.title = "规上企业分布图";
        });
        break;
      case "3":
        this.router.navigate(["./bwqyph"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '百万企业分布图'
        break;
      case "5":
        this.router.navigate(["./mjsh0"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '亩均税收'
        break;
      case "6":
        this.router.navigate(["./jtqy"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '集团企业'
        break;
      case "7":
        this.router.navigate(["./zt_djs"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '独角兽'
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
        this.router.navigate(["./summary"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = "税收数据空间可视化分析平台";
        break;
      case "2":
        this.router.navigate(["./gsqy"], { relativeTo: this.activeRoute });
        setTimeout(() => {
          this.taxDataVSrv.title = "规上工业分布图";
        });
        break;
      case "3":
        this.router.navigate(["./bwqyph"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '规上工业分布图'
        break;
      case "5":
        this.router.navigate(["./mjsh0"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '亩均税收分布图'
        break;
      case "6":
        this.router.navigate(["./jtqy"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '集团企业分布图'
        break;
      case "7":
        this.router.navigate(["./zt_djs"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '独瞪企业分布图'
        break;
      case "8":
        this.router.navigate(["./zt_gxjs"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '高新技术企业分布图'
        break;
      case "9":
        this.router.navigate(["./zt_syjg"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '税源结构分布图'
        break;
      case "10":
        this.router.navigate(["./zt_fdc"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '房地产企业分布图'
        break;
      case "11":
        this.router.navigate(["./zt_gsqy_gy"], { relativeTo: this.activeRoute });
        this.taxDataVSrv.title = '规上企业-工业分布图'
        break;
      default:
        break;

    }
    var bta = document.getElementById(flag);
    bta.style.background = 'url("../../../../assets/image/nav-bg-selected.png") no-repeat center';
    //bta.style.background = '#ffffff';
    bta.style.color = "#9d7a00";
    /*for (var i = 1; i <= 11; i++) {
      if (Number(flag) != i) {
        var btal = document.getElementById(String(i));
        if (btal != null) {
          btal.style.color = "#28d0e9";
        }
      }
    }*/
  }
}


