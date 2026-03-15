import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAdPage } from './edit-ad.page';

const routes: Routes = [
  {
    path: '',
    component: EditAdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAdRoutingModule { }
