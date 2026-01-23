import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponent } from './playground/playground.component';
import { DesignShowcaseComponent } from './design-showcase/design-showcase.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rodados',
    pathMatch: 'full'
  },
  {
    path: 'playground',
    component: PlaygroundComponent
  },
  {
    path: 'design-showcase',
    component: DesignShowcaseComponent
  },
  {
    path: 'kite-examples',
    loadChildren: () => import('./kite-examples/kite-examples.module').then(m => m.KiteExamplesModule)
  },
  {
    path: 'rodados',
    loadChildren: () => import('./rodados/rodados.module').then(m => m.RodadosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
