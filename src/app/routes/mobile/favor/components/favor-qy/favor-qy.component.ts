import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FavorService } from '../../service/favor.service';
import { Modal, ToastService } from 'ng-zorro-antd-mobile';
import { Router, ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-favor-qy',
  templateUrl: './favor-qy.component.html',
  styleUrls: ['./favor-qy.component.css']
})
export class FavorQyComponent implements OnInit, AfterViewInit {
  favorJtData = [];
  favorNsrmc = "";
  rightFavor = [{
    text: '取消收藏',
    onPress: () => {
      this.onFavor();
    },
    style:
    {
      'background-color': '#f4333c',
      color: 'white'
    }
  }];
  constructor(private favorService: FavorService,
    private cacheSrv: CacheService,
    private toastSrv: ToastService,
    private http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.favorService.segControlObservable.subscribe(e => {
      setTimeout(() => {
        e.selectedIndex = 0;
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.favorService.segControlInstance.selectedIndex = 0;
      this.getFavorData();
    }, 100);
  }


  onFavor() {
    const username = this.cacheSrv.get('userInfo', { mode: 'none' }).username;
    this.http.post('favor/destroy',
      {
        username,
        qymc: this.favorNsrmc
      }).subscribe(resp => {
        // console.log(resp);
        this.toastSrv.info(resp.msg);
        this.favorJtData = this.favorJtData.filter(item => item.qymc != this.favorNsrmc);

      });
  }

  /**
 * 收藏swipe 打开事件，获取当前纳税人名称
 * @param e 
 */
  onSwipeOpen(e) {
    this.favorNsrmc = e.qymc;
  }


  getFavorData() {
    const username = this.cacheSrv.get('userInfo', { mode: 'none' }).username;
    this.http.get('favor/index',
      {
        username,
      }).subscribe(resp => {
        this.favorJtData = resp['data'];
        // console.log(resp);
        // this.toastSrv.info(resp.msg);
      });
  }
  favorClick(e) {
    this.router.navigate(['../../eco-thematic/single'], { relativeTo: this.route, queryParams: { nsrmc: e } })
  }
}
