import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'solicitudes',
    pathMatch: 'full'
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('./solicitudes/solicitudes.module').then((m) => m.SolicitudesModule)
  },
  {
    path: 'pendiente-tyc',
    loadChildren: () => import('./pendiente-tyc/pendiente-tyc.module').then((m) => m.PendienteTycModule)
  },
  {
    path: 'prestamo-en-curso',
    loadChildren: () => import('./prestamo-en-curso/prestamo-en-curso.module').then((m) => m.PrestamoEnCursoModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RodadosRoutingModule {}
