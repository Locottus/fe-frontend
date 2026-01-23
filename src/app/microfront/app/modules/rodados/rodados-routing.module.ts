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
    path: 'pendientes-tyc',
    loadChildren: () => import('./pendiente-tyc/pendiente-tyc.module').then((m) => m.PendienteTycModule)
  },
  {
    path: 'prestamo-en-curso',
    loadChildren: () =>
      import('./prestamo-prendario-en-curso/prestamo-prendario-en-curso.module').then((m) => m.PrestamoPrendarioEnCursoModule)
  },
  {
    path: 'procesando-solicitud',
    loadChildren: () => import('./procesando-solicitud/procesando-solicitud.module').then((m) => m.ProcesandoSolicitudModule)
  },
  {
    path: 'aceptacion-tyc',
    loadChildren: () => import('./aceptacion-tyc/aceptacion-tyc.module').then((m) => m.AceptacionTycModule)
  },
  {
    path: 'preguntas-frecuentes',
    loadChildren: () => import('./preguntas-frecuentes/preguntas-frecuentes.module').then((m) => m.PreguntasFrecuentesModule)
  },
  {
    path: 'solicitud-error',
    loadChildren: () => import('./solicitud-error/solicitud-error.module').then((m) => m.SolicitudErrorModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RodadosRoutingModule {}
