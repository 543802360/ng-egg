/*
 * @Author: your name
 * @Date: 2020-03-10 09:05:00
 * @LastEditTime: 2020-03-10 09:23:47
 * @LastEditors: Please set LastEditors
 * @Description: passport 组件
 * @FilePath: /ng-egg/src/app/layout/passport/passport.component.ts
 */
import { Component } from '@angular/core';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  links = [
    {
      title: '谷歌浏览器下载',
      href: 'http://35.1.149.22:8080/soft/86_chrome.exe',
      blankTarget: true
    },
    // {
    //   title: '说明',
    //   href: '',
    // },
    // {
    //   title: '条款',
    //   href: '',
    // },
  ];
}
