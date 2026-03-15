import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { SearchResultsPageRoutingModule } from './search-results-routing.module';
import { SearchResultsPage } from './search-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SearchResultsPageRoutingModule
  ],
  declarations: [ SearchResultsPage ]
})
export class SearchResultsPageModule { }
