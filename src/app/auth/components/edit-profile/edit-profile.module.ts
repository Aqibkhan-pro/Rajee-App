import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { EditProfilePage } from './edit-profile.page';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditProfileRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfileModule { }
