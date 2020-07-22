import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { DelonChartModule } from "@delon/chart";
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UEditorModule } from 'ngx-ueditor';
import { IconPickerModule } from 'ngx-icon-picker';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { SHARED_DELON_MODULES } from './shared-delon.module';



const THIRDMODULES = [
  CountdownModule, UEditorModule, NgxTinymceModule,
  IconPickerModule
];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // third libs
    ...THIRDMODULES,
    ...SHARED_ZORRO_MODULES,
    ...SHARED_DELON_MODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule { }
