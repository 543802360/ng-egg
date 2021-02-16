import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FavorService } from '../../service/favor.service';
import { Modal, ToastService } from 'ng-zorro-antd-mobile';
import { Router, ActivatedRoute } from '@angular/router';

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

  }

  /**
 * 收藏swipe 打开事件，获取当前纳税人名称
 * @param e 
 */
  onSwipeOpen(e) {
    this.favorNsrmc = e.mc;
  }


  getFavorData() {

  }
  favorClick(e) {
    this.router.navigate(['../../syzt/single'], { relativeTo: this.route, queryParams: { nsrmc: e } })
  }
}
