import { Component, OnInit } from '@angular/core';
@Component({
    template: `
    <Navbar [rightContent]="popover">
        税源地图
    </Navbar>

    <ng-template #popover>
    <Icon Popover [ngStyle]="{ height: '100%', display: 'flex', 'align-items': 'center' }" [mask]="false"
        [showArrow]="true" [overlay]="overlay" [type]="'ellipsis'" [placement]="'bottomRight'" ></Icon>
    </ng-template>

    <ng-template #overlay>
        <PopoverItem [icon]="icon1">税源分布图</PopoverItem>
        <PopoverItem [icon]="icon2">税源热力图</PopoverItem>
        <PopoverItem [icon]="icon3">税收聚合图</PopoverItem>
    </ng-template>

    <ng-template #icon1>
       <i nz-icon nzType="dot-chart" nzTheme="outline"></i>
    </ng-template>

    <ng-template #icon2>
        <i nz-icon nzType="heat-map" nzTheme="outline"></i>
    </ng-template>

    <ng-template #icon3>
        <i nz-icon nzType="windows" nzTheme="outline"></i>
    </ng-template>

    <router-outlet></router-outlet>
    
    `,
    styleUrls: ['./eco-map.component.less']
})

export class EcoMapComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}