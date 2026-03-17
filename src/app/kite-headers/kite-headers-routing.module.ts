import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiteHeadersComponent } from './kite-headers.component';

const routes: Routes = [
  {
    path: '',
    component: KiteHeadersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KiteHeadersRoutingModule {}
