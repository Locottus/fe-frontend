import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-solicitud-resumen-vehiculo',
  templateUrl: './solicitud-resumen-vehiculo.component.html',
  styleUrls: ['./solicitud-resumen-vehiculo.component.scss']
})
export class SolicitudResumenVehiculoComponent {
  @Input() solicitud: any;
  // Mostrar avatar de negocio opcional
  @Input() showBusinessAvatar = true;
}
