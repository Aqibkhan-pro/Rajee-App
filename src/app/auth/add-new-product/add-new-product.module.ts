import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewProductPageRoutingModule } from './add-new-product-routing.module';

import { AddNewProductPage } from './add-new-product.page';
import { TranslateModule } from '@ngx-translate/core';
import { LocationPickerModalComponent } from './location-picker-modal/location-picker-modal.component';
import { CategoryPickerModalComponent } from './category-picker-modal/category-picker-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AddNewProductPageRoutingModule
  ],
  declarations: [AddNewProductPage,LocationPickerModalComponent, CategoryPickerModalComponent]
})
export class AddNewProductPageModule {}
