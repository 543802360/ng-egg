import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavorRoutingModule } from './favor-routing.module';
import { FavorMainComponent } from './components/favor-main/favor-main.component';
import { FavorQyComponent } from './components/favor-qy/favor-qy.component';
import { ModifyPwdComponent } from './components/modify-pwd/modify-pwd.component';
import { SharedModule } from '@shared';
import { MobileSharedModule } from '../mobile-shared/mobile-shared.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';



const COMPONENTS = [
  FavorMainComponent, FavorQyComponent, ModifyPwdComponent
];
const COMPONENTS_NOROUNT = [];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    MobileSharedModule,
    NgZorroAntdMobileModule,
    FavorRoutingModule
  ]
})



@NgModule({
  imports: [
    SharedModule,
    MobileSharedModule,
    NgZorroAntdMobileModule,
    EcoThematicRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class FavorModule { }

