import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { Modal, ToastService } from 'ng-zorro-antd-mobile';
import { MobileQypmConditionComponent } from '../../mobile-shared/components/qypm-condition/qypm-condition.component';

@Component({
  selector: 'app-mobile-tm-order',
  templateUrl: './tm-order.component.html',
})
export class MobileTmOrderComponent implements OnInit {

  @ViewChild('drawer') drawer: MobileQypmConditionComponent;
  url = "bdg/enterprise/order";
  nsrpmListData: any[] = [];
  nsrpmTotalData: any[] = [];
  currentPage = 1;
  totalPage = 0;
  paginationVisible = false;
  //门类选择

  //税收名次选择
  sspmData = [10, 50, 100, 200, 500, 1000, 2000];
  selectedNum = 100;
  selectedNumArray = [];
  favorNsrmc: string = "";

  rightFavor = [{
    text: '收藏',
    onPress: () => {
      this.onFavor();
    },
    style:
    {
      'background-color': '#f4333c',
      color: 'white'
    }
  }];
  constructor(
    private http: _HttpClient,
    private toastService: ToastService,
    // private favorService: FavorService,
    // private syztService: SyztService,
    // private userSerive: UserService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.getNsrpm();
    });
  }



  /**
   * 获取纳税排名
   */
  getNsrpm(e) {
    this.paginationVisible = false;
    this.currentPage = 1;
    this.totalPage = 0;
    this.toastService.loading('正在加载', 0, null, true, 'middle');
    let $stream = this.http.get(this.url, e);
    $stream.subscribe(resp => {
      this.toastService.hide();
      // 获取页数
      this.nsrpmTotalData = resp['data'] as any[];
      this.totalPage = Math.ceil(this.nsrpmTotalData.length / 30);
      this.nsrpmListData = this.nsrpmTotalData.slice((this.currentPage - 1) * 30, 30);
      setTimeout(() => {
        this.paginationVisible = true;
      });

    });

  }
  /**
   * 获取单户纳税人纳税明细
   * 
   * @param nsrmc ：纳税人名称
   */
  getNsrTaxInfo(nsrmc: string) {
    this.router.navigate(['../single'], { queryParams: { nsrmc }, relativeTo: this.route });
  }
  // 格式化money
  numberToMoney(n) {
    return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 翻页事件
   * @param e 
   */
  pageChanged(e) {
    this.currentPage = e;
    this.nsrpmListData = this.nsrpmTotalData.slice((e - 1) * 30, e * 30);
  }
  onFavor() {
    // this.favorService.createFavor(this.favorNsrmc, FAVOR.QY, this.userSerive.getUserName(), this.userSerive.getToken(), this.userSerive.getUserId())
    //   .subscribe(resp => {

    //     if (resp['flag'] == "success") {
    //       // 获取页数
    //       this.toastService.success('收藏成功！', 2000);

    //     }


    //   });
  }
  /**
   * 收藏swipe 打开事件，获取当前纳税人名称
   * @param e 
   */
  onSwipeOpen(e) {
    this.favorNsrmc = e.nsrmc;
  }

}


