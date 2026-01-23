import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes;
routes = [
  {
    path: 'rodados',
    loadChildren: () => import('./modules/rodados/rodados.module').then(m => m.RodadosModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
