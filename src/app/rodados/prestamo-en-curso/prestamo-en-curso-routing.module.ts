import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestamoEnCursoComponent } from './prestamo-en-curso.component';

const routes: Routes = [
  {
    path: '',
    component: PrestamoEnCursoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamoEnCursoRoutingModule { }
