import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MyAdsRoutingModule } from './my-ads-routing.module';
import { MyAdsPage } from './my-ads.page';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAdsRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [MyAdsPage]
})
export class MyAdsModule { }
