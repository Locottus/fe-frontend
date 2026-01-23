import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendienteTycComponent } from './pendiente-tyc.component';

const routes: Routes = [
  {
    path: '',
    component: PendienteTycComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendienteTycRoutingModule { }
