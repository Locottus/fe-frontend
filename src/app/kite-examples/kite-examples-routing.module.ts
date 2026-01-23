import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiteExamplesComponent } from './kite-examples.component';

const routes: Routes = [
  {
    path: '',
    component: KiteExamplesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiteExamplesRoutingModule { }
