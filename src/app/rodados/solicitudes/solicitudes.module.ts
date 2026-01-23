import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { SolicitudesComponent } from './solicitudes.component';
import { RodadosSharedModule } from '../shared/rodados-shared.module';

@NgModule({
  declarations: [
    SolicitudesComponent
  ],
  imports: [
    CommonModule,
    SolicitudesRoutingModule,
    RodadosSharedModule
  ]
})
export class SolicitudesModule { }
