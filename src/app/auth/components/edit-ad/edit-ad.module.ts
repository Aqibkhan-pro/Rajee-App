import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditAdRoutingModule } from './edit-ad-routing.module';
import { EditAdPage } from './edit-ad.page';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditAdRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [EditAdPage]
})
export class EditAdModule { }
