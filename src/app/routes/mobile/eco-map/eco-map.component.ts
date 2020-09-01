import { Component, OnInit } from '@angular/core';
@Component({
    template: `
    <Navbar [rightContent]="popover">
        税源地图
    </Navbar>

    <ng-template #popover>
    <Icon Popover [ngStyle]="{ height: '100%', display: 'flex', 'align-items': 'center' }" [mask]="true"
        [showArrow]="true" [overlay]="overlay" [type]="'ellipsis'" [placement]="'bottomRight'" ></Icon>
    </ng-template>

    <ng-template #overlay>
        <PopoverItem [icon]="nav_icon1">首页</PopoverItem>
        <PopoverItem [icon]="nav_icon2">退出</PopoverItem>
    </ng-template>

    <ng-template #nav_icon1>
        <i nz-icon nzType="windows"></i>
    </ng-template>

    <ng-template #nav_icon2>
        <i nz-icon nzType="close"></i>
    </ng-template>
    <router-outlet></router-outlet>
    
    `
})

export class EcoMapComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}