import { CacheService } from '@delon/cache';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchToggleStatus: boolean;
  sysTitle: string;
  constructor(public settings: SettingsService,
    private cacheSrv: CacheService) { }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    window.dispatchEvent(new Event('resize'));

  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  ngOnInit() {
    const username = this.cacheSrv.get('userInfo', { mode: 'none' }).username;
    const name = this.cacheSrv.get('userInfo', { mode: 'none' }).name;
    // username === 'admin' ? this.sysTitle = '智慧财图系统管理后台' : this.sysTitle = `${name}财源管理系统`;
    this.sysTitle = "西海岸新区财源可视化综合管控平台"
  }

}
