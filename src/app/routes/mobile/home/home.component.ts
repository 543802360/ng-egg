import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  hidden = false;
  fullScreen = true;
  tintColor = '#108ee9';
  unselectedTintColor = '#888';
  selectedIndex = 0;

  summaryVisible = true;
  mapVisible = false;
  thematicVisible = false;
  userVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {

  }



  nav(routes: any) {

    this.selectedIndex = routes.index;
    this.toggle(routes.index);

    switch (routes.index) {
      case 0:
        this.router.navigate(['./eco-summary/hy-summary'], { relativeTo: this.route });
        break;
      case 1:
        this.router.navigate(['./eco-thematic'], { relativeTo: this.route });

        break;
      case 2:
        this.router.navigate(['./map'], { relativeTo: this.route });

        break;
      case 3:
        this.router.navigate(['./favor'], { relativeTo: this.route });

        break;
      default:
        break;
    }
  }

  onSelect(event) {
    console.log(event);
  }

  onVisibleChange(event) {
    console.log(event);
  }

  toggle(index: number) {
    switch (index) {
      case 0:
        this.mapVisible = false;
        this.userVisible = false;
        this.summaryVisible = true;
        this.thematicVisible = false;
        break;
      case 1:
        this.mapVisible = false;
        this.userVisible = false;
        this.summaryVisible = false;
        this.thematicVisible = true;
        break;
      case 2:
        this.mapVisible = true;
        this.userVisible = false;
        this.summaryVisible = false;
        this.thematicVisible = false;
        break;
      case 3:
        this.mapVisible = false;
        this.userVisible = true;
        this.summaryVisible = false;
        this.thematicVisible = false;
        break;
      default:
        break;
    }
  }
}
