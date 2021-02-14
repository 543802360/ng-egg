import { JrySuggestionComponent } from './group-suggestion/group-suggestion.component';
import { JryZgsListComponent } from './zgs-list/zgs-list.component';
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { JrySummaryComponent } from './jry-summary/jry-summary.component';
import { ThematicJryRoutingModule } from './thematic-jry-routing.module';

const COMPONENTS: Type<void>[] = [JrySummaryComponent, JrySuggestionComponent, JryZgsListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    ThematicJryRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class ThematicJryModule { }
