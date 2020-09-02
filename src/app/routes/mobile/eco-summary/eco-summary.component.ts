import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    template: `
    <Navbar [rightContent]="popover">
        经济运行分析
    </Navbar>

    <ng-template #popover>
    <Icon Popover [ngStyle]="{ height: '100%', display: 'flex', 'align-items': 'center' }" [mask]="false"
        [showArrow]="true" [overlay]="overlay" [type]="'ellipsis'" [placement]="'bottomRight'" ></Icon>
    </ng-template>

    <ng-template #overlay>
        <PopoverItem [icon]="icon1">财政总收入分析</PopoverItem>
        <PopoverItem [icon]="icon2">分税种分析</PopoverItem>
        <PopoverItem [icon]="icon3">分行业分析</PopoverItem>
        <PopoverItem [icon]="icon4">分产业分析</PopoverItem>
        <PopoverItem [icon]="icon5">开票分析</PopoverItem>
    </ng-template>

    <ng-template #icon1>
        <i nz-icon nzType="database" nzTheme="outline"></i>
    </ng-template>

    <ng-template #icon2>
        <i nz-icon nzType="money-collect" nzTheme="outline"></i>
    </ng-template>

    <ng-template #icon3>
        <i nz-icon nzType="line-chart" nzTheme="outline"></i>
    </ng-template>

    <ng-template  #icon4>
        <i nz-icon nzType="pie-chart" nzTheme="outline"></i>
    </ng-template>

    <ng-template #icon5>
        <i nz-icon nzType="trademark" nzTheme="outline"></i>
    </ng-template>

    <router-outlet></router-outlet>
    `,
    styleUrls: ['./eco-summary.component.less']
})
export class EcoSummaryComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
