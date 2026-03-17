import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RodadosSharedModule { }
