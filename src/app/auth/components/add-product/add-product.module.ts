import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './add-product-routing.module';

import { AddProductPage } from './add-product.page';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapComponentComponent } from './map-component/map-component.component';
import { HarajCategorySheetComponent } from './haraj-category-sheet/haraj-category-sheet.component';
import { HarajLocationSheetComponent } from './haraj-location-sheet/haraj-location-sheet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProductPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],providers: [
    Geolocation
  ],
  declarations: [AddProductPage, MapComponentComponent ,  HarajCategorySheetComponent, HarajLocationSheetComponent]
})
export class AddProductPageModule {}
