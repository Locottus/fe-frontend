import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudResumenVehiculoComponent } from './solicitud-resumen-vehiculo.component';
import { SolicitudResumenFinancieroComponent } from './solicitud-resumen-financiero.component';
import { DetalleCuotaDrawerComponent } from './detalle-cuota-drawer/detalle-cuota-drawer.component';
import { KiteSharedModule } from './kite-shared.module';

@NgModule({
  declarations: [
    SolicitudResumenVehiculoComponent,
    SolicitudResumenFinancieroComponent,
    DetalleCuotaDrawerComponent
  ],
  imports: [
    CommonModule,
    KiteSharedModule
  ],
  exports: [
    SolicitudResumenVehiculoComponent,
    SolicitudResumenFinancieroComponent,
    DetalleCuotaDrawerComponent,
    KiteSharedModule
  ]
})
export class RodadosSharedModule { }
