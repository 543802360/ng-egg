import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { NsrmcSuggestionComponent } from './components/nsrmc-suggestion/nsrmc-suggestion.component';
import { MonthRangeComponent } from './components/month-range/month-range.component';
import { BdgSelectComponent } from './components/bdg-select/bdg-select.component';
import { TrendComponent } from "./components/trend/trend.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UEditorModule } from 'ngx-ueditor';
import { IconPickerModule } from 'ngx-icon-picker';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { XlsxModule } from '@delon/abc';



const THIRDMODULES = [
  CountdownModule, UEditorModule, NgxTinymceModule,
  IconPickerModule
];
// #endregion

// #region your componets & directives
const COMPONENTS = [
  BdgSelectComponent,
  MonthRangeComponent,
  NsrmcSuggestionComponent,
  TrendComponent,
  SummaryCardComponent,
];
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
    XlsxModule,
    // third libs
    ...THIRDMODULES,
    ...SHARED_ZORRO_MODULES,
    ...SHARED_DELON_MODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
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
