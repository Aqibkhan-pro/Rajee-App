import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CategoriesPageRoutingModule } from './categories-routing.module';
import { CategoriesPage } from './categories.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    CategoriesPageRoutingModule
  ],
  declarations: [ CategoriesPage ]
})
export class CategoriesPageModule { }
