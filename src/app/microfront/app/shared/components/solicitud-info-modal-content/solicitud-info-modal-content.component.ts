import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-solicitud-info-modal-content',
  templateUrl: './solicitud-info-modal-content.component.html',
  styleUrls: ['./solicitud-info-modal-content.component.scss']
})
export class SolicitudInfoModalContentComponent {
  @Input() solicitud: any;
  // 'vehiculo' usa solicitud?.vehiculo?.valorVehiculo; 'solicitud' usa solicitud?.solicitud?.montoInscripcionPrenda
  @Input() montoInscripcionSource: 'vehiculo' | 'solicitud' = 'vehiculo';

  getMontoInscripcion(): any {
    if (this.montoInscripcionSource === 'solicitud') {
      return this.solicitud?.solicitud?.montoInscripcionPrenda;
    }
    return this.solicitud?.vehiculo?.valorVehiculo;
  }
}
