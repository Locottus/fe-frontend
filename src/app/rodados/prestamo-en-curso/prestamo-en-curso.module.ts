import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoEnCursoRoutingModule } from './prestamo-en-curso-routing.module';
import { PrestamoEnCursoComponent } from './prestamo-en-curso.component';
import { RodadosSharedModule } from '../shared/rodados-shared.module';
import { KiteSharedModule } from '../shared/kite-shared.module';

@NgModule({
  declarations: [
    PrestamoEnCursoComponent
  ],
  imports: [
    CommonModule,
    PrestamoEnCursoRoutingModule,
    RodadosSharedModule,
    KiteSharedModule
  ]
})
export class PrestamoEnCursoModule { }
