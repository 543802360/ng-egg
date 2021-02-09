import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { EnterpriseGroupRoutingModule } from './enterprise-group-routing.module';
import { GroupSuggestionComponent } from './group-suggestion/group-suggestion.component';
import { EnterpriseGroupGroupSummaryComponent } from './group-summary/group-summary.component';
import { EnterpriseGroupZgsListComponent } from './zgs-list/zgs-list.component';

const COMPONENTS: Type<void>[] = [
  EnterpriseGroupGroupSummaryComponent,
  GroupSuggestionComponent,
  EnterpriseGroupZgsListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    EnterpriseGroupRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: []
})
export class EnterpriseGroupModule { }
