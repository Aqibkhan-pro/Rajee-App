import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SavedAdsRoutingModule } from './saved-ads-routing.module';
import { SavedAdsPage } from './saved-ads.page';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedAdsRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [SavedAdsPage]
})
export class SavedAdsModule { }
