

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SegmentedControlComponent } from 'ng-zorro-antd-mobile';
import { FavorService } from '../../service/favor.service';

@Component({
  selector: 'app-favor-main',
  templateUrl: './favor-main.component.html',
  styleUrls: ['./favor-main.component.css']
})
export class FavorMainComponent implements OnInit, AfterViewInit {

  @ViewChild('syztSeg', { static: false }) seg: SegmentedControlComponent;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private favorService: FavorService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.favorService._segControl.next(this.seg);
    this.favorService.segControlInstance = this.seg
  }

  czyxItemChange(e) {
    let { selectedIndex, value } = e;
    // console.log(selectedIndex, value);
    switch (value) {
      case '收藏企业':
        this.router.navigate(['./favorQy'], { relativeTo: this.activeRoute });
        break;
      case '修改密码':
        this.router.navigate(['./modifyPwd'], { relativeTo: this.activeRoute });
        break;

      default:
        break;
    }
  }

}
