import { NgModule } from '@angular/core';
import { ProcesandoSolicitudRoutingModule } from './procesando-solicitud-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProcesandoSolicitudComponent } from './procesando-solicitud.component';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SkeletonModule } from '@kite/angular';

@NgModule({
  declarations: [ProcesandoSolicitudComponent],
  imports: [ProcesandoSolicitudRoutingModule, CommonModule, SharedModule, KiteModule, SkeletonModule]
})
export class ProcesandoSolicitudModule {}
